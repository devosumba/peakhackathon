# Vaultmont-Lab

A **Smart CSV Data Cleaner & Uploader** built for the Peak Mobile Hackathon. This web application helps internal staff upload, clean, validate, and export CSV files containing phone numbers and bundle allocations with intelligent auto-fix suggestions and real-time balance analysis.

## ✨ Features

- 📤 **Drag-and-drop CSV Upload** - Easy file import with visual feedback
- 🔄 **Smart Phone Number Cleaning** - Automatically normalizes Kenyan phone numbers to +2547XXXXXXXX format
- ✅ **Real-time Validation** - Validates phone numbers, bundle sizes, and costs with inline error highlighting
- 🔍 **Duplicate Detection** - Identifies and removes duplicate entries
- 📊 **Summary Dashboard** - Real-time statistics including valid/invalid rows, telco distribution, and totals
- ⚖️ **Balance Analysis** - Compare available units against required bundle allocations
- 💡 **Smart Auto-Fix Suggestions** - One-click fixes for common data issues with undo support
- 📱 **Telco Detection** - Automatically identifies Safaricom, Airtel, and Telkom numbers
- 📥 **Export Options** - Download cleaned CSV or send to backend API
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone from GitHub

```bash
git clone https://github.com/devosumba/Vaultmont-Lab
cd Vaultmont-Lab
```

### 2. Install Dependencies

```bash
npm i
```

This will install all required packages including:
- React 18
- TypeScript
- Tailwind CSS
- Papaparse (CSV parsing)
- File-saver (CSV export)
- And more...

### 3. Run Local Server

```bash
npm run dev
```

The application will start on `http://localhost:8080`

Open your browser and navigate to the URL to see the app in action!

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **CSV Processing**: Papaparse
- **State Management**: React Hooks
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/
│   ├── csv/                    # CSV-specific components
│   │   ├── FileUpload.tsx      # Drag-and-drop file upload
│   │   ├── ColumnMapper.tsx    # Column mapping interface
│   │   ├── DataTable.tsx       # Main data table with editing
│   │   ├── SummaryDashboard.tsx # Statistics dashboard
│   │   ├── BalanceAnalysis.tsx  # Balance checker
│   │   ├── SmartSuggestions.tsx # Auto-fix suggestions
│   │   └── ExportActions.tsx    # Export and API actions
│   └── ui/                     # Reusable UI components (shadcn)
├── hooks/
│   └── useCsvData.ts           # Main CSV data management hook
├── utils/
│   ├── validation.ts           # Phone & data validation logic
│   ├── csv.ts                  # CSV import/export utilities
│   └── duplicates.ts           # Duplicate detection logic
├── types/
│   └── index.ts                # TypeScript type definitions
├── pages/
│   ├── Index.tsx               # Main application page
│   └── NotFound.tsx            # 404 page
└── index.css                   # Global styles & design tokens
```

## 📖 How to Use

1. **Upload CSV** - Drag and drop your CSV file or click to browse
2. **Map Columns** - Match your CSV headers to Phone, Bundle Size, and Cost fields
3. **Review & Fix** - View validation errors, apply smart suggestions, and edit data inline
4. **Check Balance** - Enter available units to verify you have sufficient allocation
5. **Export** - Download cleaned CSV with valid-only data or send to backend API

## 🎯 Built For

**Peak Mobile Hackathon** - Smart CSV Data Cleaner & Uploader

**Scoring Criteria**:
- Functionality (30%)
- Usability & UX (25%)
- Innovation (20%)
- Code Quality (15%)
- Presentation (10%)

## 👨‍💻 Author

**Developer**: [Your Name]  
**GitHub**: [@devosumba](https://github.com/devosumba)  
**Project Link**: [Vaultmont-Lab](https://github.com/devosumba/Vaultmont-Lab)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/devosumba/Vaultmont-Lab/issues).

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

**Note**: This is a hackathon MVP focused on core functionality and user experience. Some features may be simplified for demonstration purposes.
