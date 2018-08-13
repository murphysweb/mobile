$(document).ready(function() {
  // 去掉头部padding
  var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = '.js-to-hide-cart { padding-top: 0 !important; }';
  document.head.appendChild(style);

    var needreload = sessionStorage.getItem("needreload");
    if(needreload&&needreload == 1){
      location.reload();
      sessionStorage.setItem("needreload",0);
    }
    var address_id = window.address_id;
    var book_ids = window.book_ids;
    if ($(".newConfirm_right").hasClass('disableGray')) {
        return false;
    }
    $(".newConfirm_right").on("click", function() {
        sessionStorage.setItem("needreload",1);
        if(window.submit_url){
            location.href = submit_url+"&address_id=" + address_id + "&book_ids=" + book_ids;
        }else{
            location.href = "/submitBookInfo.html?address_id=" + address_id + "&book_ids=" + book_ids;
        }
    })

    $(".good_list_1_row .select_btn").click(function(){
        $(".select_btn").addClass("no_select").html("");
        $(this).removeClass("no_select").html("");
        book_ids = $(this).parents(".good_item").attr("data-goods-id");
    })
});
