$(document).ready(function(){
    // Xu ly menu
    $("#btn-show-menu").click(function(){
        if ($("#sub-memu").attr("style") == undefined) {
            $("#sub-memu").hide(200);
            $("#btn-show-menu").attr("class", "fa fa-bars");
        } else {
            $("#sub-memu").show(100);
            $("#btn-show-menu").attr("class", "fa fa-bars fa-rotate-90");
        }
   });
   $("#sub-memu li").click(function(){
       if($(this).hasClass('active') == false) {
           var sel = $(this).attr("data");
           switch(sel) {
                case "1":
                    window.location.href = './personnel';
                    break;
                case "2":
                    window.location.href = './category';
                    break;
                case "3":
                    window.location.href = './partner';
                    break;
                case "4":
                    window.location.href = './warehouse';
                    break;
                case "5":
                    window.location.href = './statistical';
                    break;
                case "6":
                    window.location.href = './message';
                    break;
                default:
                    window.location.href = './branch';
            }
       }
   });
   // Xu ly form update Category
   $("#ic-close").click(function(){
       $("#f-update").hide(200);
   });
   $("#ic-show").click(function(){
       $("#f-update").show(100);
       $("#name").val("");
       $("#depiction").val("");
       $("#id").val("-1");
   });
   $('#content').after("<i id='backToTop' class='fa fa-arrow-circle-up fa-3x' aria-hidden='true' style='display: none; position: fixed; bottom: 5px; right: 10px; cursor: pointer;'></i>");
   // Top page
   $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#backToTop').fadeIn('slow');
        } else {
            $('#backToTop').fadeOut('slow');
        }
    });
    $("#backToTop").click(function(){
       $('html, body').animate({ scrollTop: 0 }, 500);
   });
   // Input branch
   $('input.form-control').on('input', function(){
        $('tbody').children('tr').remove();
        searchbranch();
   });
});

// Show Message alert
function showAlert(tp, tl, ct) {
    if(tp === "error") {
        $("#md-div").attr("class", "modal-content modal-error");
        $("#md-title").attr("class", "fa fa-ban");
    } else if (tp === "warning") {
        $("#md-div").attr("class", "modal-content modal-warning");
        $("#md-title").attr("class", "fa fa-exclamation-triangle");
    } else {
        $("#md-div").attr("class", "modal-content modal-success");
        $("#md-title").attr("class", "fa fa-check-square-o");
    }
    $("#md-title").text(tl);
    $("#md-content").val(ct);
    $("#mdShowMes").modal('show');
}

// Branch info
function infobranch(id) {
    $.ajax({
        url: "/branch/"+id,
        type: "GET",
        success: function(data){
            if (data !== undefined) {
                $("#key").val(data.id);
                $("#name").val(data.name);
                $("#address").val(data.address);
                $("#phone").val(data.phone);
                $("#email").val(data.email);
                $("#fax").val(data.fax);    
                $("#update").removeAttr('disabled');
                $("#delete").removeAttr('disabled');
                $("#delete").attr('onclick', "deletebranch("+data.id+");");
            } else {
                $("#update").attr('disabled', 'true');
                $("#delete").attr('disabled', 'true');
            }
        },
        error: function(){
            alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
        }
    });
}
// Branch search
function searchbranch() {
    $.ajax({
        url: "/search/branch",
        type: "GET",
        data : {
            index: $('tbody').children('tr').length,
            name: $("#name").val(),
            address: $("#address").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
            fax: $("#fax").val()
        },
        success: function(data){
            if (data !== undefined) {
                if(data.length<10) {
                    $("#viewmore").hide();
                }
                if(data.length>0) {
                    var html = "";
                    for(var i=0; i<data.length; i++) {
                        html += "<tr onclick='infobranch("+ data[i].id +");'>";
                        html += "<td>"+ data[i].id +"</td>";
                        html += "<td>"+ data[i].name +"</td>";
                        html += "<td>"+ data[i].address +"</td>";
                        html += "<td class='col-phone'>"+ data[i].phone +"</td>";
                        html += "<td class='col-action'>";
                        html += "<i class='fa fa-phone-square ctr-action' aria-hidden='true' onclick='window.location.href = 'mailto:"+ data[i].email +"';'></i>";
                        html += "<i class='fa fa-envelope ctr-action' aria-hidden='true' onclick='window.location.href = 'tel:"+ data[i].phone +"';'></i>";
                        html += "<i class='fa fa-trash ctr-action' aria-hidden='true'></i>";
                        html += "</td>"
                        html += "</tr>"
                    }
                    $('tbody').append(html);
                }
            }
        },
        error: function(){
            alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
        }
    });
}
// Branch delete
function deletebranch(id) {
    var btn = confirm("Việc xóa chi nhánh ảnh hưởng đến các ràng buộc cơ sở dữ liệu !!!\n Bạn có muốn tiếp tục xóa nó không?");
    if(btn === true) {
        $.ajax({
            url: "/delete/branch/"+id,
            type: "GET",
            success: function(data){
                if (data === "Success") {
                    alert("Đã xóa thành công chi nhánh.");
                    window.location.reload(true);  
                } else {
                    alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
                }
            },
            error: function(){
                alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
            }
        });
    }
}
// Update branch
function updatebranch(iadd) {
    // Check item null
    var name = $("#name").val();
    var address = $("#address").val();
    var phone = $("#phone").val();
    if (name == "") {
        alert("Tên chi nhánh không được để trống!!!");
        $("#name").focus();
    } else if(address == "") {
        alert("Địa chỉ của chi nhánh không được để trống!!!");
        $("#address").focus();
    } else if(phone == "") {
        alert("Nhập số điện thoại chi nhánh !!!");
        $("#phone").focus();
    } else {
        // Check data exist
        $.ajax({
            url: "/search/branch",
            type: "GET",
            data : {
                index: 0,
                name: $("#name").val(),
                address: $("#address").val(),
                phone: $("#phone").val(),
                email: $("#email").val(),
                fax: $("#fax").val()
            },
            success: function(data){
                if (data !== undefined) {
                    if(data.length>0) {
                        alert("Chi nhánh đã tồn tại trong hệ thống!!!\nVui lòng thao tác lại sau.");
                    } else {
                        // Update data
                        var idChange = '-1';
                        if(iadd !== true) {
                            idChange = $("#key").val();
                        }
                        $.ajax({
                            url: "/update/branch",
                            type: "POST",
                            data: {
                                id: idChange,
                                name: $("#name").val(),
                                address: $("#address").val(),
                                phone: $("#phone").val(),
                                email: $("#email").val(),
                                fax: $("#fax").val() 
                            },
                            success: function(dataChange){
                                if (dataChange === "Success") {
                                    alert("Đã cập nhật thành công chi nhánh.");
                                    window.location.reload(true);  
                                } else {
                                    alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
                                }
                            },
                            error: function(){
                                alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
                            }
                        });
                    }
                }
            },
            error: function(){
                alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
            }
        });
    }
    
}

// Category info
function infocategory(id) {
    $.ajax({
        url: "/category/"+id,
        type: "GET",
        success: function(data){
            if (data !== undefined) {
                $("#key").val(data.id);
                $("#name").val(data.name);
                $("#description").val(data.description);  
                $("#update").removeAttr('disabled');
                $("#delete").removeAttr('disabled');
                $("#delete").attr('onclick', "deletebranch("+data.id+");");
            } else {
                $("#update").attr('disabled', 'true');
                $("#delete").attr('disabled', 'true');
            }
        },
        error: function(){
            alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
        }
    });
}
// Category search
function searchcategory() {
    $.ajax({
        url: "/search/category",
        type: "GET",
        data : {
            index: $('tbody').children('tr').length,
            name: $("#name").val()
        },
        success: function(data){
            if (data !== undefined) {
                if(data.length<10) {
                    $("#viewmore").hide();
                }
                if(data.length>0) {
                    var html = "";
                    for(var i=0; i<data.length; i++) {
                        html += "<tr onclick='infocategory("+ data[i].id +");'>";
                        html += "<td>"+ data[i].id +"</td>";
                        html += "<td>"+ data[i].name +"</td>";
                        html += "<td class='col-action'>";
                        html += "<i class='fa fa-bookmark ctr-action' aria-hidden='true' title='Click để xóa danh mục đã ghim'></i>";
                        html += "<i class='fa fa-trash ctr-action' aria-hidden='true' onclick='deletecategory('"+ data[i].id +"');'></i>";
                        html += "</td>"
                        html += "</tr>"
                    }
                    $('tbody').append(html);
                }
            }
        },
        error: function(){
            alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
        }
    });
}
// Category delete
function deletecategory(id) {
    var btn = confirm("Việc xóa danh mục ảnh hưởng đến các ràng buộc cơ sở dữ liệu !!!\n Bạn có muốn tiếp tục xóa nó không?");
    if(btn === true) {
        $.ajax({
            url: "/delete/category/"+id,
            type: "GET",
            success: function(data){
                if (data === "Success") {
                    alert("Đã xóa thành công danh mục.");
                    window.location.reload(true);  
                } else {
                    alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
                }
            },
            error: function(){
                alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
            }
        });
    }
}
// Update Category
function updatecategory(iadd) {
    // Check item null
    var name = $("#name").val();
    if (name == "") {
        alert("Tên danh mục không được để trống!!!");
        $("#name").focus();
    } else {
        // Check data exist
        $.ajax({
            url: "/search/branch",
            type: "GET",
            data : {
                index: 0,
                name: $("#name").val()
            },
            success: function(data){
                if (data !== undefined) {
                    if(data.length>0) {
                        alert("Danh mục đã tồn tại trong hệ thống!!!\nVui lòng thao tác lại sau.");
                    } else {
                        // Update data
                        var idChange = '-1';
                        if(iadd !== true) {
                            idChange = $("#key").val();
                        }
                        $.ajax({
                            url: "/update/category",
                            type: "POST",
                            data: {
                                id: idChange,
                                name: $("#name").val(),
                                description: $("#description").val()
                            },
                            success: function(dataChange){
                                if (dataChange === "Success") {
                                    alert("Đã cập nhật thành công danh mục.");
                                    window.location.reload(true);  
                                } else {
                                    alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
                                }
                            },
                            error: function(){
                                alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
                            }
                        });
                    }
                }
            },
            error: function(){
                alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
            }
        });
    }
    
}

// Show Model
function showmodelpersonnel(sel) {
    if(sel == 0) {
        $("#keymodel").val("-1");
        $("#usernamemodel").val("");
        $("#usernamemodel").removeAttr('disabled');
        $("#fullnamemodel").val("");
        $("#identitycardmodel").val("");
        $("#addressmodel").val("");
        $("#phonemodel").val("");
        $("#emailmodel").val("");
        $("#salarymodel").val("");
        $("#myModalLabel").val("Thêm nhân viên mới");
        $('#myModal').modal('show');
    } else {
        $.ajax({
            url: "/personnel/" + $("#key").val(),
            type: "GET",
            success: function(data){
                if (data !== undefined) {
                    $("#keymodel").val(data.UserId);
                    $("#usernamemodel").val(data.UserName);
                    $("#usernamemodel").attr('disabled', 'true');
                    $("#fullnamemodel").val(data.FullName);
                    $("#identitycardmodel").val(data.IdentityCard);
                    $("#addressmodel").val(data.Address);
                    $("#phonemodel").val(data.Phone);
                    $("#emailmodel").val(data.Email);
                    $("#salarymodel").val(data.TotalSalary);
                    $("#br"+data.BranchId).attr('selected', 'selected');
                    $("#ju"+data.JurisdictionId).attr('selected', 'selected');
                    $("#myModalLabel").val("Thông tin chi tiết của nhân viên");  
                    $('#myModal').modal('show');  
                } else {
                    alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
                }
            },
            error: function(){
                alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
            }
        });
    }
    
}
// Personnel info
function infopersonnel(id) {
    $.ajax({
        url: "/personnel/"+id,
        type: "GET",
        success: function(data){
            if (data !== undefined) {
                $("#key").val(data.UserName);
                $("#username").val(data.UserName);
                $("#fullname").val(data.FullName);
                $("#identitycard").val(data.IdentityCard);
                $("#address").val(data.Address);
                $("#phone").val(data.Phone);
                $("#email").val(data.Email);
                $("#salary").val(data.TotalSalary);
                $("#branch").val(data.NameBranch);    
                $("#info").removeAttr('disabled');
                $("#update").removeAttr('disabled');
                $("#delete").removeAttr('disabled');
                $("#delete").attr('onclick', "deletepersonnel("+data.UserName+");");
            } else {
                $("#info").attr('disabled', 'true');
                $("#update").attr('disabled', 'true');
                $("#delete").attr('disabled', 'true');
            }
        },
        error: function(){
            alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
        }
    });
    showAlert('error', "Lỗi chi đây", "Nội dung của lỗi");
}
// Personnel search
function searchpersonnel() {
    $.ajax({
        url: "/search/personnel",
        type: "GET",
        data : {
            index: $('tbody').children('tr').length,
            username: $("#username").val(),
            fullname: $("#fullname").val(),
            identitycard: $("#identitycard").val(),
            address: $("#address").val(),
            phone: $("#phone").val()
        },
        success: function(data){
            if (data !== undefined) {
                if(data.length<10) {
                    $("#viewmore").hide();
                }
                if(data.length>0) {
                    var html = "";
                    for(var i=0; i<data.length; i++) {
                        html += "<tr onclick='infopersonnel('"+data[i].UserName+"');'>"
                        html += "<td>"+data[i].UserId+"</td>"
                        html += "<td>"+data[i].FullName+"</td>"
                        html += "<td class='col-phone'>"+data[i].Phone+"</td>"
                        html += "<td class='col-phone'>"+data[i].Email+"</td>"
                        html += "<td class='col-phone'>"+data[i].NameJurisdiction+"</td>"
                        html += "<td class='col-action'>"
                        html += "<i class='fa fa-phone-square ctr-action' aria-hidden='true' onclick='window.location.href = 'mailto:"+data[i].Email+"';'></i>"
                        html += "<i class='fa fa-envelope ctr-action' aria-hidden='true' onclick='window.location.href = 'tel:"+data[i].Phone+"';'></i>"
                        html += "<i class='fa fa-trash ctr-action' onclick='deletepersonnel('"+data[i].UserName+"');' aria-hidden='true'></i>"
                        html += "</td>";
                        html += "</tr>";
                    }
                    $('tbody').append(html);
                }
            }
        },
        error: function(){
            alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
        }
    });
}
// Personnel delete
function deletepersonnel(id) {
    var btn = confirm("Việc xóa nhân viên ảnh hưởng đến các ràng buộc cơ sở dữ liệu !!!\n Bạn có muốn tiếp tục xóa nó không?");
    if(btn === true) {
        $.ajax({
            url: "/delete/personnel/"+id,
            type: "GET",
            success: function(data){
                if (data === "Success") {
                    alert("Đã xóa thành công nhân viên.");
                    window.location.reload(true);  
                } else {
                    alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
                }
            },
            error: function(){
                alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
            }
        });
    }
}
// Update Personnel
function updatepersonnel(iadd) {
    // Update data
    var idChange = '-1';
    if(iadd !== true) {
        idChange = $("#keymodel").val();
    }
    $.ajax({
        url: "/update/personnel",
        type: "POST",
        data: {
            id: idChange,
            username: $("#usernamemodel").val(),
            fullname: $("#fullnamemodel").val(),
            identitycard: $("#identitycardmodel").val(),
            address: $("#addressmodel").val(),
            phone: $("#phonemodel").val(),
            email: $("#emailmodel").val(),
            branch: $("#branchmodel").val(),
            jurisdiction: $("#jurisdictionmodel").val(),
            salary: $("#salarymodel").val()  
        },
        success: function(dataChange){
            if (dataChange === "Success") {
                alert("Đã cập nhật thành công nhân viên.");
                window.location.reload(true);  
            } else {
                alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
            }
        },
        error: function(){
            alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
        }
    });
}
