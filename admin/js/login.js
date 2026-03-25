$(function(){
	$('title').html(projectName+" 登录")
	$('.project-name').text(projectName)
})
function login(){
	$.cookie('session',null);
	$.cookie('id',null);
	$.cookie('name',null);
    let uname = $('#uname').val();
    let psw = $('#psw').val();
    $.ajax({
        type:"get",
        url:url+"/login/username",
        data:{
            "un":uname,
            "pw":psw
        },
        success:function(msg){
			if(msg.message.result=="登录成功！"){
				$.cookie('session', msg.message.token);
				window.location.href="/admin/index.html"; 
			}else{
				layer.msg("密码错误,请重试")
			}
        }
    })
}