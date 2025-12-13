export const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Aujourd\'hui';
    } else if (diffDays === 1) {
        return 'Hier';
    } else if (diffDays < 7) {
        return `Il y a ${diffDays} jours`;
    } else {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
};

export const formatDateFull = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format a number with thousands separators
 * @param value - The number to format
 * @returns Formatted number string (e.g., "1 234")
 */


export const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

/**
 * Format a currency value
 * @param value - The amount to format
 * @param currency - Currency code (default: 'XOF')
 * @returns Formatted currency string (e.g., "1 234 FCFA")
 */
export const formatCurrency = (value: number | undefined | null, currency: string = 'XOF'): string => {
    if (value === undefined || value === null) return '0 FCFA';

    const formattedValue = new Intl.NumberFormat('fr-FR').format(value);

    // Map currency codes to their display symbols
    const currencySymbols: { [key: string]: string } = {
        'XOF': 'FCFA',
        'XAF': 'FCFA',
        'EUR': '€',
        'USD': '$',
        'GNF': 'GNF',
    };

    const symbol = currencySymbols[currency] || currency;
    return `${formattedValue} ${symbol}`;
};