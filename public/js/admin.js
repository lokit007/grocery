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
