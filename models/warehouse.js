
var Warehouse = function(_BranchId, _BranchName, _ProductId, _ProductName, _Price, _NewNumber, _NewPrice, _OldNumber, _OldPrice, _CategoryId, _CategoryName) {
    this.BranchId = _BranchId,
    this.BranchName = _BranchName,
    this.ProductId = _ProductId,
    this.ProductName = _ProductName,
    this.Price = _Price,
    this.NewNumber = _NewNumber,
    this.NewPrice = _NewPrice,
    this.OldNumber = _OldNumber,
    this.OldPrice = _OldPrice,
    this.CategoryId = _CategoryId,
    this.CategoryName = _CategoryName
}

module.exports = Warehouse;