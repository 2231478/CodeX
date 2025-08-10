import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Transactions.module.css';
import HeaderHome from '../HeaderHome/HeaderHome'; 

function Transactions() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  const handleBankClick = () => {
    console.log("Philippine National Bank clicked!");
    // TODO: Implement PNB payment integration
  };

  const handleDragonpayClick = () => {
    console.log("Dragonpay clicked!");
    // TODO: Implement Dragonpay payment integration
  };

  return (
    <>
      <HeaderHome />
      <div className={styles.transactionsPageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.headerSection}>
            <button onClick={handleGoBack} className={styles.backButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <h1 className={styles.pageTitle}>Payment Transaction</h1>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.onlineTransactionCard}>
              <h2 className={styles.cardTitle}>Online Transaction</h2>
              <div className={styles.tableHeader}>
                <span className={styles.tableHeaderItem}>Date</span>
                <span className={styles.tableHeaderItem}>Channel</span>
                <span className={styles.tableHeaderItem}>Reference</span>
                <span className={styles.tableHeaderItem}>Amount</span>
              </div>
              <div className={styles.tableContent}>
                {/* This is where transaction rows would be dynamically rendered */}
                {/* Example row (you'd fetch this from an API) */}
                <p className={styles.noTransactions}>No transactions yet.</p>
                </div>
            </div>

            <div className={styles.sidebarContent}>
                <div className={styles.downpaymentBalanceCard}>
                <h2 className={styles.cardTitle}>Downpayment Balance</h2>
                <p className={styles.dueDate}>Due Date: <span className={styles.highlightDate}>{new Date(Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                <p className={styles.balanceAmount}>₱ {(1200.00).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                <p className={styles.note}>Please ensure the downpayment is made before the due date to avoid cancellation of your reservation.</p>
                </div>

                <div className={styles.paymentChannelsCard}>
                <h2 className={styles.cardTitle}>Payment Channels</h2>
                <div className={styles.channelButtons}>
                    <button className={styles.channelButton} onClick={handleBankClick}>
                    <img src="https://images.seeklogo.com/logo-png/49/1/philippine-national-bank-logo-png_seeklogo-498019.png" alt="Philippine National Bank" className={styles.channelLogo} />
                    </button>
                    <button className={styles.channelButton} onClick={handleDragonpayClick}>
                    <img src="https://cdn.prod.website-files.com/64199d190fc7afa82666d89c/6491bec8f19c685e9083b264_dragonpay-1.webp" alt="Dragonpay" className={styles.channelLogo} />
                    </button>
                    {/* Add more payment channels here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Transactions;