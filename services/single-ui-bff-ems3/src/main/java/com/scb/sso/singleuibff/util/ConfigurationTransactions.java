package com.scb.sso.singleuibff.util;

import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/** A caught validation error must still roll back the surrounding admin transaction. */
public final class ConfigurationTransactions {
    private ConfigurationTransactions() {}
    public static void rollback() {
        if (TransactionSynchronizationManager.isActualTransactionActive()) {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
    }
}
