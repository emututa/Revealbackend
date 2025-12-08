# Render Deployment Guide

This guide will help you deploy your Reveal backend API to Render.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **OpenAI API Key**: Get one from [OpenAI Platform](https://platform.openai.com/api-keys)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository includes these essential files:

- ✅ `package.json` - with proper scripts
- ✅ `server.js` - main application file
- ✅ `render.yaml` - Render configuration
- ✅ `.env` - your existing environment file
- ✅ `.gitignore` - proper exclusions

### 2. Connect to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing your Reveal backend

### 3. Configure the Web Service

#### Basic Settings

- **Name**: `reveal-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your deployment branch)
- **Root Directory**: Leave empty (if your code is in the root)

#### Build & Deploy Settings

- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Environment Variables

Add these environment variables in the Render dashboard:

#### Required Variables

```
NODE_ENV=production
PORT=10000
DATABASE_URL=will-be-auto-provided-by-render
```

#### API Keys

```
OPENAI_API_KEY=your_actual_openai_api_key_here
```

#### Optional Variables

```
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

**Note**: The `DATABASE_URL` will be automatically provided by Render when you create a database.

### 5. Create Database (Recommended)

1. In Render dashboard, go to **"New +"** → **"Database"**
2. Choose **"PostgreSQL"**
3. Configure:
   - **Name**: `reveal-db`
   - **Database Name**: `reveal_db`
   - **User**: `reveal_user`
4. Wait for database to be ready
5. Copy the **"Connection String"** (Internal Database URL)

### 6. Update Web Service with Database

1. Go to your web service settings
2. In **"Environment"** section, add:
   ```
   DATABASE_URL=postgresql://reveal_user:[password]@[host]:[port]/reveal_db
   ```
   (Use the connection string from step 5)

### 7. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your application
   - Start your server
   - Run health checks

### 8. Verify Deployment

After deployment, check these endpoints:

- **Health Check**: `https://your-service-name.onrender.com/health`
- **API Documentation**: `https://your-service-name.onrender.com/api`
- **Auth Test**: `https://your-service-name.onrender.com/api/auth/register`

## Troubleshooting

### Build Failures

**Issue**: Build fails with dependency errors
**Solution**:

```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues

**Issue**: Cannot connect to database
**Solution**:

1. Verify `DATABASE_URL` is correctly set
2. Check database is in the same region as your service
3. Ensure database user has proper permissions

### Environment Variables Not Working

**Issue**: API keys or config not loading
**Solution**:

1. Restart the service after adding environment variables
2. Check variable names match exactly (case-sensitive)
3. Verify no extra spaces in values

### Memory/Timeout Issues

**Issue**: Service crashes or times out
**Solution**:

1. Upgrade to a higher plan (Starter → Standard)
2. Optimize database queries
3. Add proper error handling

## Monitoring

### Logs

- View real-time logs in Render dashboard
- Check **"Events"** tab for deployment history
- Monitor **"Metrics"** for performance

### Health Checks

- Render automatically checks `/health` endpoint
- Service will restart if health checks fail
- Configure custom health check in `render.yaml` if needed

## Production Considerations

### Security

- ✅ Environment variables for sensitive data
- ✅ HTTPS enabled by default
- ✅ CORS properly configured
- ✅ Rate limiting (consider adding)

### Performance

- ✅ Database connection pooling
- ✅ Proper indexing on database tables
- ✅ Request logging middleware

### Backup

- ✅ PostgreSQL automatic backups (Render Pro)
- ✅ Export data regularly for critical information

## Environment-Specific Configurations

### Development

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/reveal_db
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Production

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:password@host:port/database
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## API Documentation

Once deployed, your API will be available at:
`https://your-service-name.onrender.com/api`

### Available Endpoints

#### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

#### User Management

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

#### Health Data

- `GET /api/health-data` - Get health information
- `POST /api/health-conditions` - Update health conditions
- `POST /api/allergic-foods` - Update allergic foods
- `POST /api/food-reactions` - Update food reactions

#### Food Scanning

- `POST /api/scan/image` - Scan food from image
- `POST /api/scan/text` - Scan food from text
- `GET /api/scan/history` - Get scan history
- `GET /api/scan/:id` - Get specific scan

### Testing the API

Use the provided test examples in `.env` file to test your endpoints with tools like Postman or curl.

## Support

If you encounter issues:

1. Check Render documentation: [docs.render.com](https://render.com/docs)
2. View application logs in Render dashboard
3. Test endpoints individually
4. Verify environment variables

## Next Steps

After successful deployment:

1. Update your frontend to use the new API URL
2. Set up custom domain (optional)
3. Configure monitoring and alerts
4. Set up CI/CD pipeline for automatic deployments
