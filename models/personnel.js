// select UserName, PassWord, IdentityCard, TotalSalary, 
// UserId, FullName, `user`.Address, `user`.Phone, `user`.Email, 
// BranchId, NameBranch, 
// JurisdictionId, `jurisdiction`.Name as NameJurisdiction, `jurisdiction`.Description
// from `admin` 
// inner join `user` on `admin`.UserId = `user`.IdUser
// inner join `jurisdiction` on `admin`.JurisdictionId = `jurisdiction`.IdJurisdiction
// inner join `branch` on `admin`.BranchId = `branch`.IdBranch