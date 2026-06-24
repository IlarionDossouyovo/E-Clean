#!/usr/bin/env pwsh
# Fix E-Clean pour SQLite

(Get-Content "prisma\schema.prisma") -replace "provider = .postgresql.", "provider = ""sqlite""" -replace "values   String\[\]", "values   String" -replace "permissions Json\?", "permissions String?" -replace "data       Json\?", "data       String?" | Set-Content "prisma\schema.prisma"

(Get-Content "prisma\schema.prisma") -replace "enum UserType {", "// enum UserType {" -replace "enum UserStatus {", "// enum UserStatus {" -replace "enum OrderStatus {", "// enum OrderStatus {" -replace "enum PaymentStatus {", "// enum PaymentStatus {" -replace "enum RefundStatus {", "// enum RefundStatus {" -replace "enum CouponType {", "// enum CouponType {" -replace "enum LoyaltyType {", "// enum LoyaltyType {" -replace "enum AdminRole {", "// enum AdminRole {" | Set-Content "prisma\schema.prisma"

npx prisma generate
npx prisma db push
Write-Host "OK! npm run dev"
