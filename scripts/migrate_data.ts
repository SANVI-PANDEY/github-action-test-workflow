#!/usr/bin/env ts-node
/**
 * Data Migration Script - UAT to Production (TypeScript)
 * Simulates database connection and data transfer for testing purposes
 */

import * as fs from 'fs';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

type TableData = User[] | Product[];

// Helper function to log messages
function logMessage(message: string): void {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    fs.appendFileSync('migration_log.txt', logEntry + '\n');
}

function logHeader(title: string): void {
    logMessage('');
    logMessage('='.repeat(70));
    logMessage(`  ${title}`);
    logMessage('='.repeat(70));
}

// Simulate database connection
async function simulateDbConnection(envPrefix: string): Promise<boolean> {
    const host = process.env[`${envPrefix}_DB_HOST`] || 'localhost';
    const user = process.env[`${envPrefix}_DB_USER`] || 'dummy_user';
    const dbName = process.env[`${envPrefix}_DB_NAME`] || 'dummy_db';
    const passwordSet = process.env[`${envPrefix}_DB_PASSWORD`] ? '***SET***' : 'NOT SET';
    
    logMessage(`🔌 Connecting to ${envPrefix} database...`);
    logMessage(`   └─ Host: ${host}`);
    logMessage(`   └─ User: ${user}`);
    logMessage(`   └─ Database: ${dbName}`);
    logMessage(`   └─ Password: ${passwordSet}`);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    logMessage(`✅ Successfully connected to ${envPrefix} database`);
    
    return true;
}

// Get dummy data based on table name
function getDummyData(tableName: string): TableData {
    const dummyData: Record<string, TableData> = {
        users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
        ],
        products: [
            { id: 101, name: 'Widget A', price: 29.99, stock: 150 },
            { id: 102, name: 'Widget B', price: 49.99, stock: 75 },
            { id: 103, name: 'Widget C', price: 99.99, stock: 25 }
        ]
    };
    
    return dummyData[tableName] || [];
}

// Export data from UAT
async function exportDataFromUat(tableName: string): Promise<TableData> {
    logMessage(`📤 Exporting data from UAT table: ${tableName}`);
    logMessage('');
    
    // Simulate connection
    if (!await simulateDbConnection('UAT')) {
        throw new Error('Failed to connect to UAT database');
    }
    
    logMessage('');
    logMessage('📊 Fetching data...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get dummy data
    const data = getDummyData(tableName);
    logMessage(`✅ Found ${data.length} records in ${tableName} table`);
    logMessage('');
    
    // Log all data
    if (data.length > 0) {
        logMessage('📋 All exported records:');
        logMessage('-'.repeat(70));
        data.forEach((record, index) => {
            logMessage(`Record #${index + 1}:`);
            Object.entries(record).forEach(([key, value]) => {
                logMessage(`   └─ ${key}: ${value}`);
            });
            logMessage('');
        });
    } else {
        logMessage('⚠️  No data found to export');
    }
    
    return data;
}

// Import data to production
async function importDataToProd(
    tableName: string,
    data: TableData,
    dryRun: boolean = true
): Promise<number> {
    const targetEnv = process.env.TARGET_ENV || 'staging';
    
    logMessage(`📥 Importing data to ${targetEnv.toUpperCase()} table: ${tableName}`);
    
    if (dryRun) {
        logMessage('  ⚠️  DRY RUN MODE - No actual changes will be made');
    }
    
    logMessage('');
    
    // Simulate connection
    if (!await simulateDbConnection('PROD')) {
        throw new Error('Failed to connect to Production database');
    }
    
    logMessage('');
    logMessage(`🔄 Processing ${data.length} records...`);
    logMessage('-'.repeat(70));
    
    for (let i = 0; i < data.length; i++) {
        const record = data[i];
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing time
        
        if (dryRun) {
            logMessage(`[DRY RUN] Would insert Record #${i + 1}:`);
            Object.entries(record).forEach(([key, value]) => {
                logMessage(`   └─ ${key}: ${value}`);
            });
        } else {
            logMessage(`✅ Inserted record ${i + 1}: ID=${(record as any).id || 'N/A'}`);
        }
    }
    
    logMessage('');
    logMessage(`✅ Successfully processed ${data.length} records`);
    
    return data.length;
}

// Main function
async function main(): Promise<void> {
    // Clear previous log
    if (fs.existsSync('migration_log.txt')) {
        fs.unlinkSync('migration_log.txt');
    }
    
    logHeader('Starting Data Migration Process');
    
    // Get configuration from environment
    const tableName = process.env.TABLE_NAME || 'users';
    const dryRun = (process.env.DRY_RUN || 'true').toLowerCase() === 'true';
    const targetEnv = process.env.TARGET_ENV || 'staging';
    
    logMessage('');
    logMessage('📋 Configuration:');
    logMessage(`   └─ Table: ${tableName}`);
    logMessage(`   └─ Target Environment: ${targetEnv}`);
    logMessage(`   └─ Dry Run: ${dryRun}`);
    logMessage('');
    
    try {
        // Step 1: Export data from UAT
        logHeader('STEP 1: Export from UAT');
        const data = await exportDataFromUat(tableName);
        
        // Step 2: Import data to Production
        logHeader('STEP 2: Import to Production');
        const recordCount = await importDataToProd(tableName, data, dryRun);
        
        // Summary
        logHeader('Migration Summary');
        logMessage('✅ Migration completed successfully');
        logMessage(`📊 Total records: ${recordCount}`);
        logMessage(`🗂️  Table: ${tableName}`);
        logMessage(`🎯 Target: ${targetEnv}`);
        if (dryRun) {
            logMessage('⚠️  DRY RUN - No actual changes made');
        }
        logMessage('='.repeat(70));
        
    } catch (error) {
        logMessage(`❌ ERROR: ${(error as Error).message}`);
        console.error(error);
        process.exit(1);
    }
}

// Run the migration
main();
