



const { User, HealthCondition, AllergicFood, FoodReaction, FoodScan } = require('../models');
const OpenAI = require("openai").default;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class ScanService {

  /** ---------------------------------------------------
   * IMAGE INGREDIENT EXTRACTION (OpenAI Vision)
   * Reads the image and extracts text/ingredients
   -----------------------------------------------------*/
  async extractIngredientsFromImage(imageBuffer, mimeType) {
    try {
      const base64Image = imageBuffer.toString('base64');
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Fast and affordable vision model
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this food label or food image carefully. 
Extract and list ALL ingredients you can see in the image. 
If it's a packaged food, read the ingredients list on the label.
If it's prepared food, identify visible ingredients.
Return ONLY a comma-separated list of ingredients, nothing else.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      });

      const ingredientsText = response.choices[0].message.content.trim();
      console.log(`✓ OpenAI Vision extracted ingredients: ${ingredientsText}`);
      
      return ingredientsText;

    } catch (error) {
      throw new Error(
        `Failed to extract ingredients from image: ${error.message}`
      );
    }
  }

  /** ---------------------------------------------------
   * FOOD SAFETY ANALYSIS (OpenAI GPT-4)
   * Analyzes extracted ingredients against user health profile
   -----------------------------------------------------*/
  async analyzeFoodSafety(userId, foodName, ingredients) {
    try {
      // Load user and relations
      const user = await User.findByPk(userId, {
        include: [
          { model: HealthCondition, as: "HealthConditions" },
          { model: AllergicFood, as: "AllergicFoods" },
          { model: FoodReaction, as: "FoodReactions" }
        ]
      });

      if (!user) throw new Error("User not found");

      const healthConditions = (user.HealthConditions || []).map(hc => hc.conditionName);
      const allergicFoods = (user.AllergicFoods || []).map(af => af.foodName);
      const foodReactions = (user.FoodReactions || []).map(fr => ({
        food: fr.foodName,
        notes: fr.medicalNotes
      }));

      const prompt = `
You are a medical food safety expert. Analyze the following food for safety based on the user's health profile.

Food Name: ${foodName}
Ingredients: ${ingredients}

User's Health Conditions: ${healthConditions.length ? healthConditions.join(", ") : "None"}
User's Allergic Foods: ${allergicFoods.length ? allergicFoods.join(", ") : "None"}
User's Past Food Reactions: ${foodReactions.length ? JSON.stringify(foodReactions) : "None"}

Carefully check if any ingredient matches or is related to the user's allergies, health conditions, or past reactions.

Return ONLY valid JSON in this exact format:
{
  "is_safe": true or false,
  "risk_level": "safe" or "caution" or "danger",
  "warnings": ["list of specific warnings"],
  "explanation": "detailed reason for the assessment"
}
`;

      // OpenAI API call for safety analysis
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Fast and affordable for analysis
        messages: [
          { 
            role: "system", 
            content: "You are a medical food safety expert. Analyze food ingredients against user health profiles. Return only valid JSON with no additional text." 
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const analysis = JSON.parse(completion.choices[0].message.content);

      // Save scan to database
      await FoodScan.create({
        userId,
        foodName,
        ingredients,
        isSafe: analysis.is_safe,
        analysisResult: analysis.explanation,
        warnings: (analysis.warnings || []).join(", ")
      });

      return {
        foodName,
        ingredients,
        isSafe: analysis.is_safe,
        riskLevel: analysis.risk_level,
        warnings: analysis.warnings,
        explanation: analysis.explanation
      };

    } catch (error) {
      throw new Error(`Failed to analyze food safety: ${error.message}`);
    }
  }

  /** ---------------------------------------------------
   * COMBINED IMAGE SCAN
   * Step 1: OpenAI Vision extracts ingredients from image
   * Step 2: OpenAI GPT analyzes safety
   -----------------------------------------------------*/
  async scanFoodImage(userId, foodName, imageBuffer, mimeType) {
    try {
      // Step 1: Extract ingredients using OpenAI Vision
      console.log('Step 1: Extracting ingredients from image using OpenAI Vision...');
      const ingredients = await this.extractIngredientsFromImage(imageBuffer, mimeType);
      
      if (!ingredients || ingredients.length === 0) {
        throw new Error('No ingredients could be extracted from the image');
      }

      console.log('Extracted ingredients:', ingredients);

      // Step 2: Analyze safety using OpenAI
      console.log('Step 2: Analyzing food safety using OpenAI...');
      const analysis = await this.analyzeFoodSafety(userId, foodName, ingredients);

      return analysis;

    } catch (error) {
      throw new Error(`Failed to scan food image: ${error.message}`);
    }
  }

  /** ---------------------------------------------------
   * TEXT-ONLY ANALYSIS
   * For when user provides ingredients as text
   -----------------------------------------------------*/
  async scanFoodText(userId, foodName, ingredientsText) {
    try {
      console.log('Analyzing food from text input using OpenAI...');
      const analysis = await this.analyzeFoodSafety(userId, foodName, ingredientsText);
      return analysis;
    } catch (error) {
      throw new Error(`Failed to scan food text: ${error.message}`);
    }
  }

  /** ---------------------------------------------------
   * SCAN HISTORY
   -----------------------------------------------------*/
  async getScanHistory(userId, limit = 50) {
    try {
      const scans = await FoodScan.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
        limit
      });

      return scans.map(scan => ({
        id: scan.id,
        foodName: scan.foodName,
        isSafe: scan.isSafe,
        warnings: scan.warnings,
        scannedAt: scan.createdAt
      }));

    } catch (error) {
      throw new Error(`Failed to retrieve scan history: ${error.message}`);
    }
  }

  /** ---------------------------------------------------
   * SINGLE SCAN
   -----------------------------------------------------*/
  async getScanById(scanId, userId) {
    try {
      const scan = await FoodScan.findOne({
        where: { id: scanId, userId }
      });

      if (!scan) throw new Error("Scan not found");

      return {
        id: scan.id,
        foodName: scan.foodName,
        ingredients: scan.ingredients,
        isSafe: scan.isSafe,
        analysisResult: scan.analysisResult,
        warnings: scan.warnings,
        scannedAt: scan.createdAt
      };

    } catch (error) {
      throw new Error(`Failed to retrieve scan: ${error.message}`);
    }
  }
}

module.exports = new ScanService();