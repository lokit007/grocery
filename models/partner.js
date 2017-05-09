var Partner = function(idSupplier, name, phone, email, address, userId, userName) {
    this.Id = idSupplier,
    this.Name = name,
    this.Phone = phone,
    this.Email = email,
    this.Address = address,
    this.UserId = userId,
    this.Delegate = userName
}

module.exports = Partner;