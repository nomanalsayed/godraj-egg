# Godrej Egg Production Forecasting System

A comprehensive Nuxt 3 application for managing and forecasting egg production data with local SQLite database storage.

## 🚀 Features

- **Dashboard**: Overview of parent stock placement and production metrics
- **Weekly Forecast**: Detailed weekly production forecasting with age-based calculations
- **Analytics**: Visual charts and data analysis
- **Local Database**: SQLite database for data persistence
- **CSV Import**: Automatic import of weekly production data
- **Responsive Design**: Modern UI with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm

## 🛠️ Installation

1. **Navigate to the project directory:**
   ```bash
   cd nuxt-godrej-egg
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **The database will be automatically created on first run**

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
nuxt-godrej-egg/
├── pages/
│   ├── index.vue          # Dashboard page
│   ├── forecast.vue       # Weekly forecast page
│   └── analytics.vue      # Analytics page
├── layouts/
│   └── default.vue        # Main layout with navigation
├── server/
│   ├── api/
│   │   └── parent-stock.get.ts  # API endpoint for data
│   └── utils/
│       └── db.ts          # Database utilities and CSV import
├── data/
│   └── weekly.csv         # Source CSV data
├── app.vue                # Root component
├── nuxt.config.ts         # Nuxt configuration
└── package.json           # Dependencies
```

## 🗄️ Database Schema

### Parent Stock Table
```sql
CREATE TABLE parent_stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  age INTEGER NOT NULL,
  week_date TEXT NOT NULL,
  birds INTEGER DEFAULT 0,
  production INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 📊 Data Flow

1. **CSV Import**: On server startup, `weekly.csv` is automatically imported into SQLite
2. **API Layer**: Server API endpoints provide data access
3. **Pages**: Vue components fetch and display data
4. **Calculations**: Weekly forecasts are calculated based on age and production rates

## 🎯 Key Calculations

### Production Forecasting
- **Age-based production**: Different production rates for different age groups
- **Weekly aggregation**: Sum of production across all age groups
- **Trend analysis**: Historical data comparison

### Metrics Tracked
- Parent stock placement by age
- Weekly egg production
- Production efficiency
- Age distribution

## 🔧 Configuration

### Database Location
The SQLite database is created at: `nuxt-godrej-egg/data/production.db`

### CSV Data Format
The CSV file should contain:
- Age columns (0-65 weeks)
- Weekly date columns
- Production data for each age/week combination

## 📱 Pages Overview

### 1. Dashboard (`/`)
- Overview of current parent stock
- Total birds by age group
- Recent production summary
- Quick statistics

### 2. Weekly Forecast (`/forecast`)
- Detailed weekly production forecast
- Age-wise breakdown
- Production trends
- Exportable data tables

### 3. Analytics (`/analytics`)
- Visual charts and graphs
- Production trends over time
- Age distribution analysis
- Performance metrics

## 🎨 Styling

The application uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-friendly layouts
- **Modern UI**: Clean and professional interface

## 🔌 API Endpoints

### GET `/api/parent-stock`
Returns all parent stock data from the database.

**Response:**
```json
[
  {
    "id": 1,
    "age": 24,
    "week_date": "2017-08-05",
    "birds": 6100,
    "production": 0
  }
]
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Hosting
The built application can be deployed to:
- Vercel
- Netlify
- Node.js hosting
- Static hosting (with SSG)

## 🔍 Troubleshooting

### Database Issues
If the database doesn't initialize:
```bash
# Delete the database and restart
rm data/production.db
npm run dev
```

### CSV Import Issues
Ensure `data/weekly.csv` exists and has the correct format.

### Port Already in Use
Change the port in `nuxt.config.ts` or use:
```bash
PORT=3001 npm run dev
```

## 📝 Development Notes

### Adding New Features
1. Create new pages in `pages/` directory
2. Add API endpoints in `server/api/`
3. Update navigation in `layouts/default.vue`

### Database Queries
Use the `getDb()` function from `server/utils/db.ts`:
```typescript
import { getDb } from '~/server/utils/db'

const db = await getDb()
const data = db.prepare('SELECT * FROM parent_stock').all()
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Godrej Agrovet.

## 🆘 Support

For issues or questions:
- Check the troubleshooting section
- Review the code documentation
- Contact the development team

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Dashboard, Forecast, and Analytics pages
- SQLite database integration
- CSV data import
- Responsive design

## 🎯 Future Enhancements

- [ ] User authentication
- [ ] Data export functionality
- [ ] Advanced filtering options
- [ ] Real-time data updates
- [ ] Mobile app version
- [ ] Multi-farm support
- [ ] Predictive analytics with ML

---

**Built with Nuxt 3** | **Powered by SQLite** | **Styled with Tailwind CSS**
