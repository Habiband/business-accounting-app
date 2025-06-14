// Global state
let currentUser = null;
let transactions = [
    {
        id: 1,
        type: 'income',
        amount: 5000,
        description: 'Client payment for web development',
        category: 'Sales Revenue',
        date: '2025-06-14',
        status: 'approved'
    },
    {
        id: 2,
        type: 'expense',
        amount: 250,
        description: 'Office supplies purchase',
        category: 'Office Supplies',
        date: '2025-06-13',
        status: 'pending'
    },
    {
        id: 3,
        type: 'expense',
        amount: 1200,
        description: 'Marketing campaign',
        category: 'Marketing',
        date: '2025-06-12',
        status: 'approved'
    }
];

// Authentication
function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in real app, this would be server-side)
    if (email === 'admin@example.com' && password === 'password') {
        currentUser = {
            email: email,
            name: 'Admin User',
            role: 'admin'
        };
        
        // Hide login page and show dashboard
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('navbar').style.display = 'block';
        showPage('dashboard');
        
        // Show success message
        showNotification('Login successful! Welcome back.', 'success');
    } else {
        showNotification('Invalid credentials. Please try again.', 'error');
    }
}

function logout() {
    currentUser = null;
    document.getElementById('navbar').style.display = 'none';
    hideAllPages();
    document.getElementById('loginPage').style.display = 'flex';
    showNotification('You have been logged out.', 'info');
}

// Page navigation
function showPage(pageName) {
    hideAllPages();
    
    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.style.display = 'block';
        pageElement.classList.add('fade-in');
        
        // Load page-specific content
        if (pageName === 'transactions') {
            loadTransactions();
        }
    }
}

function hideAllPages() {
    const pages = ['dashboardPage', 'transactionsPage', 'reportsPage', 'usersPage'];
    pages.forEach(pageId => {
        const element = document.getElementById(pageId);
        if (element) {
            element.style.display = 'none';
            element.classList.remove('fade-in');
        }
    });
}

// Transaction management
function showAddTransactionForm() {
    document.getElementById('addTransactionForm').style.display = 'block';
}

function hideAddTransactionForm() {
    document.getElementById('addTransactionForm').style.display = 'none';
    // Reset form
    document.getElementById('transactionType').value = 'expense';
    document.getElementById('transactionAmount').value = '';
    document.getElementById('transactionDescription').value = '';
    document.getElementById('transactionCategory').value = '';
}

function addTransaction(event) {
    event.preventDefault();
    
    const type = document.getElementById('transactionType').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const description = document.getElementById('transactionDescription').value;
    const category = document.getElementById('transactionCategory').value;
    
    if (!amount || !description || !category) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    const newTransaction = {
        id: transactions.length + 1,
        type: type,
        amount: amount,
        description: description,
        category: category,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
    };
    
    transactions.unshift(newTransaction);
    loadTransactions();
    hideAddTransactionForm();
    showNotification('Transaction added successfully!', 'success');
}

function loadTransactions() {
    const container = document.getElementById('transactionsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    transactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'flex items-center justify-between p-4 border rounded-lg';
        
        const statusColor = transaction.status === 'approved' ? 'text-green-600' : 
                           transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600';
        
        const typeColor = transaction.type === 'income' ? 'text-green-600' : 'text-red-600';
        const typeSymbol = transaction.type === 'income' ? '+' : '-';
        
        transactionElement.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'}"></div>
                <div>
                    <p class="font-medium">${transaction.description}</p>
                    <p class="text-sm text-gray-500">${transaction.category} • ${transaction.date}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold ${typeColor}">
                    ${typeSymbol}$${transaction.amount.toLocaleString()}
                </p>
                <p class="text-sm ${statusColor}">
                    ${transaction.status}
                </p>
            </div>
        `;
        
        container.appendChild(transactionElement);
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${getNotificationColor(type)}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'bg-green-500 text-white';
        case 'error': return 'bg-red-500 text-white';
        case 'warning': return 'bg-yellow-500 text-white';
        default: return 'bg-blue-500 text-white';
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Set default values for demo
    document.getElementById('email').value = 'admin@example.com';
    document.getElementById('password').value = 'password';
    
    // Show login page initially
    document.getElementById('loginPage').style.display = 'flex';
    
    console.log('Business Accounting App initialized');
    console.log('Demo credentials: admin@example.com / password');
});

// User Management Functions
let users = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        department: 'Management',
        status: 'active'
    },
    {
        id: 2,
        name: 'John Smith',
        email: 'john.accountant@example.com',
        role: 'accountant',
        department: 'Finance',
        status: 'active'
    },
    {
        id: 3,
        name: 'Jane Doe',
        email: 'jane.employee@example.com',
        role: 'employee',
        department: 'Sales',
        status: 'active'
    }
];

function addUser() {
    const name = prompt('Enter full name:');
    const email = prompt('Enter email:');
    const role = prompt('Enter role (admin/accountant/employee/shareholder):');
    const department = prompt('Enter department:');

    if (name && email && role && department) {
        const newUser = {
            id: users.length + 1,
            name: name,
            email: email,
            role: role,
            department: department,
            status: 'active'
        };

        users.push(newUser);
        loadUsers();
        showNotification('User added successfully!', 'success');
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newName = prompt('Enter new name:', user.name);
    const newDepartment = prompt('Enter new department:', user.department);
    const newRole = prompt('Enter new role (admin/accountant/employee/shareholder):', user.role);

    if (newName && newDepartment && newRole) {
        user.name = newName;
        user.department = newDepartment;
        user.role = newRole;

        loadUsers();
        showNotification('User updated successfully!', 'success');
    }
}

function deleteUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.id === 1) {
        showNotification('Cannot delete the main admin user!', 'error');
        return;
    }

    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
        users = users.filter(u => u.id !== userId);
        loadUsers();
        showNotification('User deleted successfully!', 'success');
    }
}

function toggleUserStatus(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        loadUsers();
        showNotification(`User ${user.status === 'active' ? 'activated' : 'deactivated'} successfully!`, 'success');
    }
}

function loadUsers() {
    // This function would update the users display in the HTML
    // For now, it just logs the users
    console.log('Users updated:', users);
}

// Export functions for global access
window.login = login;
window.logout = logout;
window.showPage = showPage;
window.showAddTransactionForm = showAddTransactionForm;
window.hideAddTransactionForm = hideAddTransactionForm;
window.addTransaction = addTransaction;
window.addUser = addUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.toggleUserStatus = toggleUserStatus;
