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
// Click item Category and Update
function updatecategory(e, id) {
    $("#f-update").show(100);
    $("#name").focus();
    var ls = $(e).parent().parent().children();
    if($(e).prev().hasClass('fa-toggle-off')) {
        $("#show").removeAttr('checked');
    } else {
        $("#show").attr('checked', 'true');
    }
    $("#name").val($(ls[0]).text());
    $("#depiction").val($(ls[2]).text());
    $("#id").val(id);
}
// Click item Category is show/hide
function showcategory(e, idChange) {
    var ishow = 0
    if($(e).hasClass('fa-toggle-off')) ishow = 0;
    else ishow = 1;
    $.ajax({
        url: "/admin/category/update/"+idChange+"/"+ishow,
        type: "GET",
        success: function(data){
            if (data == "OK") {
                if(ishow == 0) $(e).removeClass('fa-toggle-off').addClass('fa-toggle-on');
                else $(e).removeClass('fa-toggle-on').addClass('fa-toggle-off');
            }
        },
        error: function(){
            alert("Không cập nhật được cơ sở dữ liệu!!!\nVui lòng thao tác lại sau.");
        }
    });

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
                if(data.length<10) $("#viewmore").hide();
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