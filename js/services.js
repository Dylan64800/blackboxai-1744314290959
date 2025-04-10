// Data Service for FacturePro
const FactureProService = {
    // User Management
    users: {
        getAll() {
            return JSON.parse(localStorage.getItem('users')) || [
                {
                    id: 1,
                    email: 'admin@facturepro.com',
                    password: 'Admin2024!',
                    role: 'admin',
                    name: 'Administrateur',
                    company: 'FacturePro'
                }
            ];
        },

        save(users) {
            localStorage.setItem('users', JSON.stringify(users));
        },

        create(userData) {
            const users = this.getAll();
            const newUser = {
                id: users.length + 1,
                ...userData,
                role: 'user'
            };
            users.push(newUser);
            this.save(users);
            return newUser;
        },

        authenticate(email, password) {
            const users = this.getAll();
            return users.find(user => user.email === email && user.password === password);
        }
    },

    // Client Management
    clients: {
        getAll() {
            const savedClients = JSON.parse(localStorage.getItem('clients'));
            if (savedClients) return savedClients;

            // Sample data for demonstration
            const sampleClients = [
                {
                    id: 1,
                    company: 'Acme Corporation',
                    name: 'John Doe',
                    email: 'john.doe@acme.com',
                    phone: '+33 1 23 45 67 89',
                    address: '123 Avenue des Champs-Élysées\n75008 Paris\nFrance',
                    createdAt: '2024-01-10T08:00:00Z'
                }
            ];

            localStorage.setItem('clients', JSON.stringify(sampleClients));
            return sampleClients;
        },

        save(clients) {
            localStorage.setItem('clients', JSON.stringify(clients));
        },

        create(clientData) {
            const clients = this.getAll();
            const newClient = {
                id: clients.length + 1,
                ...clientData,
                createdAt: new Date().toISOString()
            };
            clients.push(newClient);
            this.save(clients);
            return newClient;
        },

        update(id, clientData) {
            const clients = this.getAll();
            const index = clients.findIndex(client => client.id === id);
            if (index !== -1) {
                clients[index] = { ...clients[index], ...clientData };
                this.save(clients);
                return clients[index];
            }
            return null;
        },

        delete(id) {
            const clients = this.getAll();
            const filtered = clients.filter(client => client.id !== id);
            this.save(filtered);
        },

        // New: Get client analytics
        getAnalytics() {
            const clients = this.getAll();
            const invoices = FactureProService.invoices.getAll();

            return {
                totalClients: clients.length,
                newClientsThisMonth: clients.filter(client => {
                    const createdAt = new Date(client.createdAt);
                    const now = new Date();
                    return createdAt.getMonth() === now.getMonth() && 
                           createdAt.getFullYear() === now.getFullYear();
                }).length,
                topClients: clients.map(client => {
                    const clientInvoices = invoices.filter(inv => inv.clientId === client.id);
                    const totalAmount = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
                    return {
                        id: client.id,
                        name: client.company,
                        totalAmount,
                        invoiceCount: clientInvoices.length
                    };
                }).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5)
            };
        }
    },

    // Invoice Management
    invoices: {
        getAll() {
            const savedInvoices = JSON.parse(localStorage.getItem('invoices'));
            if (savedInvoices) return savedInvoices;

            // Sample data for demonstration
            const sampleInvoices = [
                {
                    id: 1,
                    number: 'FACT-2024-001',
                    clientId: 1,
                    clientName: 'Acme Corporation',
                    items: [
                        { description: 'Développement site web - Phase 1', quantity: 1, price: 250000 }
                    ],
                    subtotal: 250000,
                    tax: 50000,
                    total: 300000,
                    status: 'paid',
                    createdAt: '2024-01-15T10:00:00Z',
                    paidAt: '2024-01-20T14:30:00Z',
                    dueDate: '2024-02-14T10:00:00Z'
                },
                {
                    id: 2,
                    number: 'FACT-2024-002',
                    clientId: 1,
                    clientName: 'Acme Corporation',
                    items: [
                        { description: 'Développement site web - Phase 2', quantity: 1, price: 300000 }
                    ],
                    subtotal: 300000,
                    tax: 60000,
                    total: 360000,
                    status: 'paid',
                    createdAt: '2024-02-20T11:00:00Z',
                    paidAt: '2024-02-25T09:15:00Z',
                    dueDate: '2024-03-21T11:00:00Z'
                },
                {
                    id: 3,
                    number: 'FACT-2024-003',
                    clientId: 1,
                    clientName: 'Acme Corporation',
                    items: [
                        { description: 'Maintenance mensuelle - Mars', quantity: 1, price: 80000 }
                    ],
                    subtotal: 80000,
                    tax: 16000,
                    total: 96000,
                    status: 'paid',
                    createdAt: '2024-03-01T14:00:00Z',
                    paidAt: '2024-03-05T16:45:00Z',
                    dueDate: '2024-03-31T14:00:00Z'
                },
                {
                    id: 4,
                    number: 'FACT-2024-004',
                    clientId: 1,
                    clientName: 'Acme Corporation',
                    items: [
                        { description: 'Maintenance mensuelle - Avril', quantity: 1, price: 80000 }
                    ],
                    subtotal: 80000,
                    tax: 16000,
                    total: 96000,
                    status: 'pending',
                    createdAt: '2024-04-01T09:00:00Z',
                    dueDate: '2024-04-30T09:00:00Z'
                }
            ];

            localStorage.setItem('invoices', JSON.stringify(sampleInvoices));
            return sampleInvoices;
        },

        save(invoices) {
            localStorage.setItem('invoices', JSON.stringify(invoices));
        },

        create(invoiceData) {
            const invoices = this.getAll();
            const newInvoice = {
                id: invoices.length + 1,
                number: `FACT-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
                ...invoiceData,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            invoices.push(newInvoice);
            this.save(invoices);
            return newInvoice;
        },

        update(id, invoiceData) {
            const invoices = this.getAll();
            const index = invoices.findIndex(invoice => invoice.id === id);
            if (index !== -1) {
                invoices[index] = { ...invoices[index], ...invoiceData };
                this.save(invoices);
                return invoices[index];
            }
            return null;
        },

        delete(id) {
            const invoices = this.getAll();
            const filtered = invoices.filter(invoice => invoice.id !== id);
            this.save(filtered);
        },

        getStats() {
            const invoices = this.getAll();
            return {
                total: invoices.reduce((sum, inv) => sum + inv.total, 0),
                pending: invoices.filter(inv => inv.status === 'pending')
                    .reduce((sum, inv) => sum + inv.total, 0),
                paid: invoices.filter(inv => inv.status === 'paid')
                    .reduce((sum, inv) => sum + inv.total, 0),
                count: invoices.length,
                pendingCount: invoices.filter(inv => inv.status === 'pending').length,
                paidCount: invoices.filter(inv => inv.status === 'paid').length
            };
        },

        // New: Get monthly analytics
        getMonthlyAnalytics() {
            const invoices = this.getAll();
            const now = new Date();
            const currentYear = now.getFullYear();
            
            // Initialize monthly data with French month names
            const monthlyData = Array(12).fill(0).map((_, index) => ({
                month: new Date(currentYear, index).toLocaleString('fr-FR', { month: 'long' }),
                total: 0,
                count: 0,
                paid: 0,
                pending: 0
            }));

            // Process each invoice
            invoices.forEach(invoice => {
                const date = new Date(invoice.createdAt);
                // Only process invoices from the current year
                if (date.getFullYear() === currentYear) {
                    const month = date.getMonth();
                    monthlyData[month].total += invoice.total;
                    monthlyData[month].count += 1;

                    // Update paid/pending amounts
                    if (invoice.status === 'paid') {
                        monthlyData[month].paid += invoice.total;
                    } else {
                        monthlyData[month].pending += invoice.total;
                    }
                }
            });

            // Convert amounts from cents to euros if needed
            monthlyData.forEach(data => {
                data.total = parseFloat(data.total.toFixed(2));
                data.paid = parseFloat(data.paid.toFixed(2));
                data.pending = parseFloat(data.pending.toFixed(2));
            });

            return monthlyData;
        },

        // New: Get yearly analytics
        getYearlyAnalytics() {
            const invoices = this.getAll();
            
            // Get unique years from invoices
            const years = [...new Set(invoices.map(inv => new Date(inv.createdAt).getFullYear()))].sort();
            
            // Calculate analytics for each year
            const yearlyData = years.map(year => {
                const yearInvoices = invoices.filter(inv => new Date(inv.createdAt).getFullYear() === year);
                
                // Calculate totals
                const total = yearInvoices.reduce((sum, inv) => sum + inv.total, 0);
                const paid = yearInvoices
                    .filter(inv => inv.status === 'paid')
                    .reduce((sum, inv) => sum + inv.total, 0);
                const pending = yearInvoices
                    .filter(inv => inv.status === 'pending')
                    .reduce((sum, inv) => sum + inv.total, 0);

                return {
                    year,
                    total: parseFloat(total.toFixed(2)),
                    count: yearInvoices.length,
                    paid: parseFloat(paid.toFixed(2)),
                    pending: parseFloat(pending.toFixed(2))
                };
            });

            // If no data for current year, add it
            const currentYear = new Date().getFullYear();
            if (!years.includes(currentYear)) {
                yearlyData.push({
                    year: currentYear,
                    total: 0,
                    count: 0,
                    paid: 0,
                    pending: 0
                });
            }

            return yearlyData.sort((a, b) => a.year - b.year);
        },

        // New: Get payment analytics
        getPaymentAnalytics() {
            const invoices = this.getAll();
            const paidInvoices = invoices.filter(inv => inv.status === 'paid');
            
            return {
                averagePaymentTime: paidInvoices.reduce((sum, inv) => {
                    const created = new Date(inv.createdAt);
                    const paid = new Date(inv.paidAt);
                    return sum + (paid - created) / (1000 * 60 * 60 * 24);
                }, 0) / (paidInvoices.length || 1),
                paymentDistribution: {
                    onTime: paidInvoices.filter(inv => {
                        const dueDate = new Date(inv.dueDate);
                        const paidDate = new Date(inv.paidAt);
                        return paidDate <= dueDate;
                    }).length,
                    late: paidInvoices.filter(inv => {
                        const dueDate = new Date(inv.dueDate);
                        const paidDate = new Date(inv.paidAt);
                        return paidDate > dueDate;
                    }).length
                }
            };
        }
    },

    // Settings Management
    settings: {
        get() {
            return JSON.parse(localStorage.getItem('settings')) || {
                companyName: 'FacturePro',
                address: '',
                phone: '',
                email: '',
                taxRate: 20,
                currency: 'EUR',
                paymentTerms: 30,
                logo: null
            };
        },

        save(settings) {
            localStorage.setItem('settings', JSON.stringify(settings));
        },

        update(newSettings) {
            const current = this.get();
            const updated = { ...current, ...newSettings };
            this.save(updated);
            return updated;
        }
    }
};
