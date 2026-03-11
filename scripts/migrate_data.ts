#!/usr/bin/env ts-node
/**
 * Data Migration Script - UAT to Production (TypeScript)
 * Advanced version with batch processing, migration strategies, and date filtering
 * Simulates database connection and data transfer for testing purposes
 */

import * as fs from 'fs';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at?: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    updated_at?: string;
}

interface Order {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    total: number;
    order_date: string;
}

type TableData = (User | Product | Order)[];

interface MigrationConfig {
    tableName: string;
    targetEnv: string;
    dryRun: boolean;
    migrationStrategy: 'full' | 'incremental' | 'differential';
    batchSize: number;
    dateFilterStart?: string;
    dateFilterEnd?: string;
    createBackup: boolean;
    validateData: boolean;
    rollbackOnError: boolean;
}

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

// Helper to partially show sensitive values (shows last 4 chars)
function partialShow(value: string | undefined, label: string): string {
    if (!value || value.length === 0) return `${label}: NOT SET`;
    if (value.length <= 4) return `${label}: ***`;
    const visible = value.slice(-4);
    const masked = '*'.repeat(Math.min(value.length - 4, 8));
    return `${label}: ${masked}${visible}`;
}

// Simulate database connection
async function simulateDbConnection(envPrefix: string): Promise<boolean> {
    const host = process.env[`${envPrefix}_DB_HOST`] || 'localhost';
    const user = process.env[`${envPrefix}_DB_USER`] || 'dummy_user';
    const dbName = process.env[`${envPrefix}_DB_NAME`] || 'dummy_db';
    const password = process.env[`${envPrefix}_DB_PASSWORD`];
    
    logMessage(`🔌 Connecting to ${envPrefix} database...`);
    
    // Show config with partial masking to verify values are set
    logMessage(`   Configuration Check:`);
    logMessage(`   ${partialShow(host, 'Host')}`);
    logMessage(`   ${partialShow(user, 'User')}`);
    logMessage(`   ${partialShow(dbName, 'Database')}`);
    logMessage(`   Password: ${password ? '***SET***' : 'NOT SET'}`);
    
    logMessage(`   ✓ Host length: ${host.length} chars`);
    logMessage(`   ✓ User length: ${user.length} chars`);
    logMessage(`   ✓ DB name length: ${dbName.length} chars`);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 500));
    logMessage(`✅ Successfully connected to ${envPrefix} database`);
    
    return true;
}

// Get dummy data based on table name
function getDummyData(tableName: string, config: MigrationConfig): TableData {
    const dummyData: Record<string, TableData> = {
        users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', created_at: '2026-03-01' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', created_at: '2026-03-05' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', created_at: '2026-03-08' },
            { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'moderator', created_at: '2026-03-10' },
            { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', created_at: '2026-03-12' }
        ],
        products: [
            { id: 101, name: 'Widget A', price: 29.99, stock: 150, updated_at: '2026-03-02' },
            { id: 102, name: 'Widget B', price: 49.99, stock: 75, updated_at: '2026-03-04' },
            { id: 103, name: 'Widget C', price: 99.99, stock: 25, updated_at: '2026-03-06' },
            { id: 104, name: 'Widget D', price: 19.99, stock: 200, updated_at: '2026-03-09' },
            { id: 105, name: 'Widget E', price: 149.99, stock: 10, updated_at: '2026-03-11' }
        ],
        orders: [
            { id: 1001, user_id: 1, product_id: 101, quantity: 2, total: 59.98, order_date: '2026-03-01' },
            { id: 1002, user_id: 2, product_id: 102, quantity: 1, total: 49.99, order_date: '2026-03-03' },
            { id: 1003, user_id: 3, product_id: 103, quantity: 1, total: 99.99, order_date: '2026-03-05' },
            { id: 1004, user_id: 1, product_id: 104, quantity: 5, total: 99.95, order_date: '2026-03-07' },
            { id: 1005, user_id: 4, product_id: 105, quantity: 1, total: 149.99, order_date: '2026-03-09' },
            { id: 1006, user_id: 2, product_id: 101, quantity: 3, total: 89.97, order_date: '2026-03-11' }
        ]
    };
    
    let data = dummyData[tableName] || [];
    
    // Apply date filtering if configured
    if (config.dateFilterStart || config.dateFilterEnd) {
        data = filterByDateRange(data, config);
    }
    
    // Apply migration strategy filtering
    if (config.migrationStrategy === 'incremental') {
        // Simulate incremental: only last 50% of records
        const halfIndex = Math.ceil(data.length / 2);
        data = data.slice(halfIndex);
        logMessage(`🔄 Incremental strategy: Selecting ${data.length} newest records`);
    } else if (config.migrationStrategy === 'differential') {
        // Simulate differential: random subset
        const count = Math.ceil(data.length * 0.6);
        data = data.slice(0, count);
        logMessage(`🔄 Differential strategy: Selecting ${data.length} changed records`);
    }
    
    return data;
}

// Filter data by date range
function filterByDateRange(data: TableData, config: MigrationConfig): TableData {
    const { dateFilterStart, dateFilterEnd } = config;
    
    if (!dateFilterStart && !dateFilterEnd) {
        return data;
    }
    
    logMessage(`📅 Applying date filter: ${dateFilterStart || 'start'} to ${dateFilterEnd || 'end'}`);
    
    return data.filter((record: any) => {
        const dateField = record.order_date || record.created_at || record.updated_at;
        if (!dateField) return true;
        
        const recordDate = new Date(dateField);
        const startDate = dateFilterStart ? new Date(dateFilterStart) : new Date('1900-01-01');
        const endDate = dateFilterEnd ? new Date(dateFilterEnd) : new Date('2100-12-31');
        
        return recordDate >= startDate && recordDate <= endDate;
    });
}

// Create backup
async function createBackup(tableName: string): Promise<void> {
    logMessage('💾 Creating backup before migration...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const backupFile = `backup_${tableName}_${new Date().toISOString().split('T')[0]}.sql`;
    logMessage(`✅ Backup created: ${backupFile}`);
}

// Validate data integrity
async function validateData(data: TableData, tableName: string): Promise<boolean> {
    logMessage('✅ Running data validation...');
    logMessage(`   └─ Checking ${data.length} records...`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate validation checks
    const checks = [
        'Checking for duplicate IDs',
        'Validating required fields',
        'Checking data types',
        'Validating foreign keys',
        'Checking business rules'
    ];
    
    for (const check of checks) {
        logMessage(`   ✓ ${check}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    logMessage('✅ All validation checks passed!');
    return true;
}

// Export data from UAT
async function exportDataFromUat(config: MigrationConfig): Promise<TableData> {
    logMessage(`📤 Exporting data from UAT table: ${config.tableName}`);
    logMessage(`   └─ Strategy: ${config.migrationStrategy}`);
    logMessage('');
    
    // Simulate connection
    if (!await simulateDbConnection('UAT')) {
        throw new Error('Failed to connect to UAT database');
    }
    
    logMessage('');
    logMessage('📊 Fetching data...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get dummy data
    const data = getDummyData(config.tableName, config);
    logMessage(`✅ Found ${data.length} records in ${config.tableName} table`);
    logMessage('');
    
    // Log all data
    if (data.length > 0) {
        logMessage('📋 Exported records:');
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

// Import data to target environment with batch processing
async function importDataToTarget(
    config: MigrationConfig,
    data: TableData
): Promise<number> {
    const targetEnvPrefix = config.targetEnv.toUpperCase();
    
    logMessage(`📥 Importing data to ${targetEnvPrefix} table: ${config.tableName}`);
    logMessage(`   └─ Batch size: ${config.batchSize}`);
    
    if (config.dryRun) {
        logMessage('  ⚠️  DRY RUN MODE - No actual changes will be made');
    }
    
    logMessage('');
    
    // Determine the correct env prefix for connection
    const dbEnvPrefix = config.targetEnv === 'staging' ? 'STAGING' : 'PROD';
    
    // Simulate connection
    if (!await simulateDbConnection(dbEnvPrefix)) {
        throw new Error(`Failed to connect to ${targetEnvPrefix} database`);
    }
    
    logMessage('');
    
    // Process in batches
    const totalRecords = data.length;
    const batchCount = Math.ceil(totalRecords / config.batchSize);
    
    logMessage(`🔄 Processing ${totalRecords} records in ${batchCount} batch(es)...`);
    logMessage('='.repeat(70));
    
    let processedCount = 0;
    
    for (let batchNum = 0; batchNum < batchCount; batchNum++) {
        const start = batchNum * config.batchSize;
        const end = Math.min(start + config.batchSize, totalRecords);
        const batch = data.slice(start, end);
        
        logMessage('');
        logMessage(`📦 Batch ${batchNum + 1}/${batchCount} (Records ${start + 1}-${end}):`);
        logMessage('-'.repeat(70));
        
        for (let i = 0; i < batch.length; i++) {
            const record = batch[i];
            await new Promise(resolve => setTimeout(resolve, 50)); // Simulate processing time
            
            if (config.dryRun) {
                logMessage(`[DRY RUN] Would insert Record #${start + i + 1}: ID=${(record as any).id || 'N/A'}`);
            } else {
                logMessage(`✅ Inserted record ${start + i + 1}: ID=${(record as any).id || 'N/A'}`);
            }
            
            processedCount++;
        }
        
        logMessage(`✅ Batch ${batchNum + 1} complete: ${batch.length} records processed`);
        
        // Simulate batch commit
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    logMessage('');
    logMessage(`✅ Successfully processed ${processedCount} records in ${batchCount} batch(es)`);
    
    return processedCount;
}

// Main function
async function main(): Promise<void> {
    // Clear previous log
    if (fs.existsSync('migration_log.txt')) {
        fs.unlinkSync('migration_log.txt');
    }
    
    logHeader('Advanced Data Migration Process');
    
    // Parse configuration from environment
    const config: MigrationConfig = {
        tableName: process.env.TABLE_NAME || 'users',
        targetEnv: process.env.TARGET_ENV || 'staging',
        dryRun: (process.env.DRY_RUN || 'true').toLowerCase() === 'true',
        migrationStrategy: (process.env.MIGRATION_STRATEGY || 'incremental') as 'full' | 'incremental' | 'differential',
        batchSize: parseInt(process.env.BATCH_SIZE || '1000', 10),
        dateFilterStart: process.env.DATE_FILTER_START,
        dateFilterEnd: process.env.DATE_FILTER_END,
        createBackup: (process.env.CREATE_BACKUP || 'true').toLowerCase() === 'true',
        validateData: (process.env.VALIDATE_DATA || 'true').toLowerCase() === 'true',
        rollbackOnError: (process.env.ROLLBACK_ON_ERROR || 'true').toLowerCase() === 'true'
    };
    
    logMessage('');
    logMessage('📋 Migration Configuration:');
    logMessage('='.repeat(70));
    logMessage(`   └─ Table: ${config.tableName}`);
    logMessage(`   └─ Target Environment: ${config.targetEnv.toUpperCase()}`);
    logMessage(`   └─ Migration Strategy: ${config.migrationStrategy}`);
    logMessage(`   └─ Batch Size: ${config.batchSize} records`);
    logMessage(`   └─ Dry Run: ${config.dryRun ? 'YES (no changes)' : 'NO (real migration)'}`);
    logMessage(`   └─ Create Backup: ${config.createBackup ? 'YES' : 'NO'}`);
    logMessage(`   └─ Validate Data: ${config.validateData ? 'YES' : 'NO'}`);
    logMessage(`   └─ Rollback on Error: ${config.rollbackOnError ? 'YES' : 'NO'}`);
    
    if (config.dateFilterStart || config.dateFilterEnd) {
        logMessage(`   └─ Date Range: ${config.dateFilterStart || 'beginning'} to ${config.dateFilterEnd || 'end'}`);
    }
    
    logMessage('='.repeat(70));
    logMessage('');
    
    // Safety warning for production
    if (config.targetEnv === 'production' && !config.dryRun) {
        logMessage('⚠️  WARNING: PRODUCTION MIGRATION - REAL CHANGES WILL BE MADE!');
        logMessage('');
    }
    
    try {
        // Step 0: Create backup if enabled
        if (config.createBackup && !config.dryRun) {
            logHeader('STEP 0: Backup Current Data');
            await createBackup(config.tableName);
        }
        
        // Step 1: Export data from UAT
        logHeader('STEP 1: Export from UAT');
        const data = await exportDataFromUat(config);
        
        if (data.length === 0) {
            logMessage('⚠️  No data to migrate. Exiting...');
            return;
        }
        
        // Step 2: Validate data if enabled
        if (config.validateData) {
            logHeader('STEP 2: Validate Data');
            const isValid = await validateData(data, config.tableName);
            if (!isValid) {
                throw new Error('Data validation failed');
            }
        }
        
        // Step 3: Import data to target
        const stepNum = config.validateData ? 3 : 2;
        logHeader(`STEP ${stepNum}: Import to ${config.targetEnv.toUpperCase()}`);
        const recordCount = await importDataToTarget(config, data);
        
        // Step 4: Post-migration validation
        if (config.validateData && !config.dryRun) {
            logHeader(`STEP ${stepNum + 1}: Post-Migration Validation`);
            await validateData(data, config.tableName);
        }
        
        // Summary
        logHeader('✅ Migration Summary');
        logMessage('');
        logMessage('🎉 Migration completed successfully!');
        logMessage('');
        logMessage('📊 Statistics:');
        logMessage(`   └─ Total records processed: ${recordCount}`);
        logMessage(`   └─ Table: ${config.tableName}`);
        logMessage(`   └─ Target: ${config.targetEnv.toUpperCase()}`);
        logMessage(`   └─ Strategy: ${config.migrationStrategy}`);
        logMessage(`   └─ Batch size: ${config.batchSize}`);
        logMessage(`   └─ Total batches: ${Math.ceil(recordCount / config.batchSize)}`);
        
        if (config.dryRun) {
            logMessage('');
            logMessage('⚠️  DRY RUN - No actual changes made');
            logMessage('💡 Run with DRY_RUN=false to perform real migration');
        } else {
            logMessage('');
            logMessage('✅ Real migration completed - changes have been applied');
        }
        
        logMessage('='.repeat(70));
        logMessage('');
        
    } catch (error) {
        logMessage('');
        logMessage('❌ ERROR OCCURRED!');
        logMessage('='.repeat(70));
        logMessage(`Error: ${(error as Error).message}`);
        
        if (config.rollbackOnError && !config.dryRun) {
            logMessage('');
            logMessage('🔄 Rollback enabled - Would restore from backup...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            logMessage('✅ Rollback complete - data restored to previous state');
        }
        
        logMessage('='.repeat(70));
        console.error(error);
        process.exit(1);
    }
}

// Handle 'all' tables
async function migrateAllTables(): Promise<void> {
    const tables = ['users', 'products', 'orders'];
    const originalTable = process.env.TABLE_NAME;
    
    logMessage('🔄 Migrating all tables...');
    logMessage('');
    
    for (const table of tables) {
        process.env.TABLE_NAME = table;
        await main();
        logMessage('');
        logMessage('─'.repeat(70));
        logMessage('');
    }
    
    process.env.TABLE_NAME = originalTable;
}

// Run the migration
const tableName = process.env.TABLE_NAME || 'users';
if (tableName === 'all') {
    migrateAllTables();
} else {
    main();
}
