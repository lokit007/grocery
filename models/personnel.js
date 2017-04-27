
var Personnel = function(UserName, PassWord, IdentityCard, TotalSalary, UserId, FullName, Address, Phone, Email, BranchId, NameBranch, JurisdictionId, NameJurisdiction, Description) {
    this.UserName = UserName,
    this.PassWord = PassWord,
    this.IdentityCard = IdentityCard,
    this.TotalSalary = TotalSalary,
    this.UserId = UserId,
    this.FullName = FullName,
    this.Address = Address,
    this.Phone = Phone,
    this.Email = Email,
    this.BranchId = BranchId,
    this.NameBranch = NameBranch,
    this.JurisdictionId = JurisdictionId,
    this.NameJurisdiction = NameJurisdiction,
    this.Description = Description
}

module.exports = Personnel;