# **Tazkarti Frontend**

## **Project Overview**
Tazkarti Frontend is the client-side application for the Tazkarti sports ticket reservation system. Built using **React.js**, this web application provides a seamless user interface for customers, managers, and admins to browse matches, book tickets, and manage events. It integrates with the [Tazkarti Backend](https://github.com/AhmedZahran02/Tazkarti-BackEnd) to offer a complete solution for sports event management.

---

## **Key Features**
- **User Authentication:**  
  - Secure login and signup for customers, managers, and administrators.

- **Role-Based Views:**  
  - **Admin:** Manage user approvals and system configurations.  
  - **Manager:** Create and manage matches and seating arrangements.  
  - **Customer:** View match schedules and book tickets.  

- **Dynamic Match Management:**  
  - View match details, seating layouts, and availability.

- **Responsive Design:**  
  - Accessible across desktop and mobile devices.

---

## **Project Structure**
```
Tazkarti-FrontEnd/
├── admin/         # Components for admin functionalities
├── context/       # Context for global state management
├── customer/      # Components for customer views
├── home/          # Components for the home page
├── login/         # Login components
├── manager/       # Manager-specific views
├── match/         # Match-related components
├── signup/        # Signup components
├── App.js         # Main application entry point
├── footer.js      # Footer component
└── header.js      # Header component
```

---

## **Getting Started**

### **Prerequisites**
- Node.js  
- NPM or Yarn  

### **Setup**
1. Clone the repository:  
   ```bash
   git clone https://github.com/AhmedZahran02/Tazkarti-FrontEnd.git
   cd Tazkarti-FrontEnd
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Start the development server:  
   ```bash
   npm start
   ```

4. Access the application at [http://localhost:3000](http://localhost:3000).

---

## **Available Components**

### **Admin Components (`admin/`)**  
- Manage user approvals and perform system configurations.

### **Customer Components (`customer/`)**  
- View available matches and book tickets.

### **Home Components (`home/`)**  
- Display the landing page and featured matches.

### **Login & Signup (`login/`, `signup/`)**  
- User authentication components for secure access.

### **Manager Components (`manager/`)**  
- Create, edit, and manage matches and venue details.

### **Match Components (`match/`)**  
- Display match schedules, details, and seating layouts.

---

## **Future Enhancements**
- Enhanced UI/UX improvements for ticket booking.
- Real-time seating updates.
- Integration with payment gateway services.
- Notifications for ticket updates.

---

## **Contributions**
Contributions are welcome! Please submit a pull request or open an issue for any suggestions.  

---

## **License**
This project is licensed under the [MIT License](LICENSE).  
