#!/bin/bash

# List of files to update
files=(
    "app/admin/settings/page.tsx"
    "app/admin/products/page.tsx"
    "app/admin/services/page.tsx"
    "app/admin/analytics/page.tsx"
    "app/admin/booking-approvals/page.tsx"
    "app/super-admin/settings/page.tsx"
    "app/super-admin/products/page.tsx"
    "app/super-admin/services/page.tsx"
    "app/super-admin/staff/page.tsx"
    "app/super-admin/analytics/page.tsx"
    "app/super-admin/financial/page.tsx"
    "app/super-admin/branches/page.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Add useState import if not present
        if ! grep -q "import { useState }" "$file"; then
            sed -i '' '1a\
import { useState } from '\''react'\'';
' "$file"
        fi
        
        # Add cn import if not present
        if ! grep -q "import { cn }" "$file"; then
            sed -i '' '/import { AdminSidebar, AdminMobileSidebar }/a\
import { cn } from "@/lib/utils";
' "$file"
        fi
        
        # Add sidebarOpen state if not present
        if ! grep -q "sidebarOpen.*useState" "$file"; then
            sed -i '' '/const handleLogout = () => {/a\
  const [sidebarOpen, setSidebarOpen] = useState(false);
' "$file"
        fi
        
        # Update AdminSidebar usage
        sed -i '' 's/<AdminSidebar role=/<AdminSidebar role=/g' "$file"
        sed -i '' 's/onLogout={handleLogout} \/>/onLogout={handleLogout}\
          isOpen={sidebarOpen}\
          onToggle={() => setSidebarOpen(!sidebarOpen)} \/>/g' "$file"
        
        # Update AdminMobileSidebar usage
        sed -i '' 's/<AdminMobileSidebar role=/<AdminMobileSidebar role=/g' "$file"
        sed -i '' 's/onLogout={handleLogout} \/>/onLogout={handleLogout}\
          isOpen={sidebarOpen}\
          onToggle={() => setSidebarOpen(!sidebarOpen)} \/>/g' "$file"
        
        # Update main content div
        sed -i '' 's/<div className="flex-1 lg:ml-64">/<div className={cn(\
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",\
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"\
        )}>/g' "$file"
        
        echo "Updated $file"
    fi
done

echo "All files updated!"
