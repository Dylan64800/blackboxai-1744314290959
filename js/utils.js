const Utils = {
    checkAuth() {
        return !!sessionStorage.getItem('userId');
    },

    isAdmin() {
        const userId = sessionStorage.getItem('userId');
        const users = FactureProService.users.getAll();
        const user = users.find(u => u.id === parseInt(userId));
        return user && user.role === 'admin';
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    },

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    calculateInvoiceTotals(items) {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const tax = subtotal * 0.20; // 20% TVA
        const total = subtotal + tax;
        return { subtotal, tax, total };
    },

    showSuccess(message) {
        const successMessage = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        
        if (successMessage && successText) {
            successText.textContent = message;
            successMessage.classList.remove('hidden');
            setTimeout(() => successMessage.classList.add('hidden'), 3000);
        }
    },

    showError(message) {
        alert(message); // Simple error display for now
    },

    validation: {
        validateForm(data, rules) {
            const errors = {};

            Object.keys(rules).forEach(field => {
                const value = data[field];
                const fieldRules = rules[field];

                if (fieldRules.required && !value) {
                    errors[field] = `Le champ ${fieldRules.label} est requis`;
                }

                if (fieldRules.email && value && !this.isValidEmail(value)) {
                    errors[field] = `${fieldRules.label} n'est pas une adresse email valide`;
                }

                if (fieldRules.phone && value && !this.isValidPhone(value)) {
                    errors[field] = `${fieldRules.label} n'est pas un numéro de téléphone valide`;
                }
            });

            return errors;
        },

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        isValidPhone(phone) {
            return /^(\+\d{1,3}[\s-]?)?\d{10}$/.test(phone.replace(/[\s-]/g, ''));
        }
    },

    // New: Analytics helpers
    analytics: {
        calculateGrowth(current, previous) {
            if (!previous) return 0;
            return ((current - previous) / previous) * 100;
        },

        getMonthName(monthIndex) {
            return new Date(2024, monthIndex).toLocaleString('fr-FR', { month: 'long' });
        },

        formatPercentage(value) {
            return `${value.toFixed(1)}%`;
        },

        getQuarter(date) {
            return Math.floor(date.getMonth() / 3) + 1;
        },

        groupByPeriod(data, period = 'month') {
            const grouped = {};
            
            data.forEach(item => {
                const date = new Date(item.createdAt);
                let key;
                
                switch(period) {
                    case 'month':
                        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        break;
                    case 'quarter':
                        key = `${date.getFullYear()}-Q${this.getQuarter(date)}`;
                        break;
                    case 'year':
                        key = date.getFullYear().toString();
                        break;
                }
                
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(item);
            });
            
            return grouped;
        },

        calculateTrends(data, period = 'month') {
            const grouped = this.groupByPeriod(data, period);
            const periods = Object.keys(grouped).sort();
            
            return periods.map((period, index) => {
                const currentTotal = grouped[period].reduce((sum, item) => sum + item.total, 0);
                const previousTotal = index > 0 ? 
                    grouped[periods[index - 1]].reduce((sum, item) => sum + item.total, 0) : 
                    0;
                
                return {
                    period,
                    total: currentTotal,
                    growth: this.calculateGrowth(currentTotal, previousTotal),
                    count: grouped[period].length
                };
            });
        }
    }
};
