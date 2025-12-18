# Clean Architecture Migration - Cleanup Script
# This script safely removes old files that have been replaced by the new Clean Architecture

Write-Host "=== Clean Architecture Cleanup Script ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$backupDir = ".backup-old-code-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"
$dryRun = $false  # Set to $false to actually delete files

# Files and directories to remove (already replaced)
$itemsToRemove = @(
    # Old Field service (REPLACED by src/core/application/use-cases/field/)
    "lib\services\field.service.ts",
    
    # Old Field actions (REPLACED by src/infrastructure/http/actions/field.actions.ts)
    "actions\field.actions.ts"
    
    # Other old services (to be removed after UI integration)
    # "lib\services\crop.service.ts",      # Remove after Crop UI integration
    # "lib\services\planting.service.ts",  # Remove after Planting UI integration
    # "lib\services\inventory.service.ts", # Remove after Inventory UI integration
    # "lib\services\user.service.ts",      # Remove after User UI integration
    
    # Old base service (once all services migrated)
    # "lib\services\base.service.ts",
    
    # Old actions (to be removed after UI integration)
    # "actions\crop.actions.ts",
    # "actions\planting.actions.ts",
    # "actions\inventory.actions.ts",
    # "actions\user.actions.ts"
)

Write-Host "Mode: " -NoNewline
if ($dryRun) {
    Write-Host "DRY RUN (no files will be deleted)" -ForegroundColor Yellow
} else {
    Write-Host "LIVE MODE (files will be deleted)" -ForegroundColor Red
}
Write-Host ""

# Create backup directory if not in dry run mode
if (-not $dryRun) {
    Write-Host "Creating backup directory: $backupDir" -ForegroundColor Green
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Track statistics
$stats = @{
    Found = 0
    NotFound = 0
    BackedUp = 0
    Deleted = 0
}

Write-Host "Scanning for files to remove..." -ForegroundColor Cyan
Write-Host ""

foreach ($item in $itemsToRemove) {
    $fullPath = Join-Path (Get-Location) $item
    
    if (Test-Path $fullPath) {
        $stats.Found++
        Write-Host "[FOUND] $item" -ForegroundColor Yellow
        
        if (-not $dryRun) {
            # Create backup
            $backupPath = Join-Path $backupDir $item
            $backupParent = Split-Path $backupPath -Parent
            
            if (-not (Test-Path $backupParent)) {
                New-Item -ItemType Directory -Path $backupParent -Force | Out-Null
            }
            
            Copy-Item $fullPath $backupPath -Force
            $stats.BackedUp++
            Write-Host "  → Backed up to: $backupPath" -ForegroundColor Gray
            
            # Delete original
            Remove-Item $fullPath -Force
            $stats.Deleted++
            Write-Host "  → Deleted" -ForegroundColor Red
        } else {
            Write-Host "  → Would be deleted (dry run)" -ForegroundColor Gray
        }
    } else {
        $stats.NotFound++
        Write-Host "[NOT FOUND] $item" -ForegroundColor DarkGray
    }
    Write-Host ""
}

# Check for empty directories
$dirsToCheck = @(
    "lib\services",
    "actions"
)

Write-Host "Checking for empty directories..." -ForegroundColor Cyan
Write-Host ""

foreach ($dir in $dirsToCheck) {
    $fullPath = Join-Path (Get-Location) $dir
    
    if (Test-Path $fullPath) {
        $items = Get-ChildItem $fullPath -Force
        
        if ($items.Count -eq 0) {
            Write-Host "[EMPTY] $dir" -ForegroundColor Yellow
            
            if (-not $dryRun) {
                Remove-Item $fullPath -Force -Recurse
                Write-Host "  → Directory removed" -ForegroundColor Red
            } else {
                Write-Host "  → Would be removed (dry run)" -ForegroundColor Gray
            }
        } else {
            Write-Host "[NOT EMPTY] $dir ($($items.Count) items remaining)" -ForegroundColor Green
        }
    }
    Write-Host ""
}

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Files found:     $($stats.Found)" -ForegroundColor Yellow
Write-Host "Files not found: $($stats.NotFound)" -ForegroundColor DarkGray
if (-not $dryRun) {
    Write-Host "Files backed up:  $($stats.BackedUp)" -ForegroundColor Green
    Write-Host "Files deleted:    $($stats.Deleted)" -ForegroundColor Red
    Write-Host "Backup location:  $backupDir" -ForegroundColor Green
}
Write-Host ""

if ($dryRun) {
    Write-Host "To actually delete files, edit this script and set:" -ForegroundColor Yellow
    Write-Host '$dryRun = $false' -ForegroundColor White
} else {
    Write-Host "Cleanup complete! Backup saved in: $backupDir" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify the application still works correctly" -ForegroundColor White
Write-Host "2. Once other modules are integrated, uncomment and remove their old files" -ForegroundColor White
Write-Host "3. Run this script again to clean up remaining old code" -ForegroundColor White
