import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const DEFAULT_RATE = 87.0; // Fallback rate: 1 USD ≈ 87 INR

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('cafe_currency_v2') || 'USD';
  });

  const [exchangeRate, setExchangeRate] = useState(DEFAULT_RATE);
  const [isLiveRate, setIsLiveRate] = useState(false);

  // Fetch live exchange rate from open API
  useEffect(() => {
    let isMounted = true;
    const fetchRate = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.rates?.INR) {
            setExchangeRate(Number(data.rates.INR));
            setIsLiveRate(true);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live exchange rate, using default rate:', err);
      }
    };

    fetchRate();
    // Refresh rate every 15 minutes
    const interval = setInterval(fetchRate, 15 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const toggleCurrency = () => {
    setCurrency(prev => {
      const next = prev === 'USD' ? 'INR' : 'USD';
      localStorage.setItem('cafe_currency_v2', next);
      return next;
    });
  };

  const changeCurrency = (curr) => {
    if (curr === 'INR' || curr === 'USD') {
      setCurrency(curr);
      localStorage.setItem('cafe_currency_v2', curr);
    }
  };

  /**
   * Converts and rounds numeric values:
   * - In INR: rounded integer (e.g. 199, 200, 250)
   * - In USD: rounded to clean figures in 0.50 steps (e.g. $2, $2.5, $3, $3.5, $4)
   */
  const convertPrice = (amountInINR) => {
    const numeric = typeof amountInINR === 'number' ? amountInINR : parseFloat(String(amountInINR).replace(/[^0-9.]/g, '')) || 0;
    if (currency === 'INR') {
      return Math.round(numeric);
    }
    // Convert to USD and round to nearest 0.5 step
    const rawUsd = numeric / exchangeRate;
    const roundedUsd = Math.round(rawUsd * 2) / 2;
    return Math.max(1, roundedUsd);
  };

  /**
   * Formats price string with symbol:
   * - INR: ₹199, ₹200
   * - USD: $2, $2.50, $3, $3.50
   */
  const formatPrice = (amountInINR, isTotal = false) => {
    const numeric = typeof amountInINR === 'number' ? amountInINR : parseFloat(String(amountInINR).replace(/[^0-9.]/g, '')) || 0;
    
    if (currency === 'INR') {
      if (isTotal) {
        return `₹${Math.round(numeric).toLocaleString('en-IN')}`;
      }
      return `₹${Math.round(numeric).toLocaleString('en-IN')}`;
    }

    // USD formatting with clean cafe figures
    const usd = convertPrice(numeric);
    // If it's a whole dollar ($2, $3, $4), show as $2, $3
    // If it has .5 ($2.50, $3.50), show with standard two decimals or clean single decimal
    const formatted = usd % 1 === 0 ? `$${usd}` : `$${usd.toFixed(2)}`;
    return formatted;
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        toggleCurrency, 
        changeCurrency, 
        exchangeRate, 
        isLiveRate, 
        convertPrice, 
        formatPrice,
        currencySymbol: currency === 'INR' ? '₹' : '$'
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

