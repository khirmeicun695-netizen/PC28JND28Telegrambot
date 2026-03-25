/****index试剂使用频率分析图表****/
$(document).ready(function() {

	var apply_today; //今日申请的次数
	var check_today; //今日审核的次数
	var inventory_today; //今日库存预警的次数
	var error_today; //今日异常的次数

	var value_sum = 0;//申请药剂总次数
	var value_max;//申请次数最多的药剂次数
	var name_max;//申请次数最多的药剂名称
	var value_min;//申请次数最少的药剂次数
	var name_min;//申请次数最少的药剂名称
	
	var usagerate = []; //饼状图试剂数据
	var errorchartsdate = [];
	/*请求药品申请数量接口*/
	var date = new Date();
	var begintime = date.getFullYear()+"-"+(date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1)+"-"+(date.getDate()<10?'0'+date.getDate():date.getDate())+"T"+(date.getHours()<10?'0'+date.getHours():date.getHours())+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())+":"+(date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())
	var endtime = date.getFullYear()+"-"+(date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1)+"-"+(date.getDate()<10?'0'+date.getDate():date.getDate())+"T"+(date.getHours()<10?'0'+date.getHours():date.getHours())+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())+":"+(date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds())
	$.ajax({
		type:"get",
		url:url+"/chart/jr",
		data:JSON.stringify({
			"cookie":$.cookie('session')
		}),
		success:function(msg){
			if(msg.message.jrls==null){
				msg.message.jrls=0
			}
			if(msg.message.jryl==null){
				msg.message.jryl=0
			}
			if(msg.message.jrtzcs==null){
				msg.message.jrtzcs=0
			}
			if(msg.message.xzcwj==null){
				msg.message.xzcwj=0
			}
			if(msg.message.jrcz==null){
				msg.message.jrcz=0
			}
			if(msg.message.jrtx==null){
				msg.message.jrtx=0
			}
			if(msg.message.dczczsq==null){
				msg.message.dczczsq=0
			}
			if(msg.message.dcztxsq==null){
				msg.message.dcztxsq=0
			}
			if(msg.message.jrsl==null){
				msg.message.jrsl=0
			}
			$('#apply_today').text(msg.message.jrls.toFixed(2));
			$('#error_today').text(msg.message.jryl.toFixed(2));
			$('#check_today').text(msg.message.jrtzcs);
			$('#inventory_today').text(msg.message.xzcwj);
			$('#pay_today').text(msg.message.jrcz.toFixed(2));
			$('#withdrawal_today').text(msg.message.jrtx.toFixed(2));
			$('#dczczsq_today').text(msg.message.dczczsq);
			$('#dcztxsq_today').text(msg.message.dcztxsq);
			$('#shenglv_today').text((parseFloat(msg.message.jrsl)*100).toFixed(2));
		},
		error:function(err){
			layer.msg('登录过期，请刷新主页后重新登录！');
		}
	})
	
	$.ajax({
		type:"get",
		url:url+"/chart/all",
		data:JSON.stringify({
			"cookie":$.cookie('session')
		}),
		success:function(msg){
			if(msg.message.jrls==null){
				msg.message.jrls=0
			}
			if(msg.message.jryl==null){
				msg.message.jryl=0
			}
			if(msg.message.jrtzcs==null){
				msg.message.jrtzcs=0
			}
			if(msg.message.xzcwj==null){
				msg.message.xzcwj=0
			}
			if(msg.message.jrcz==null){
				msg.message.jrcz=0
			}
			if(msg.message.jrtx==null){
				msg.message.jrtx=0
			}
			if(msg.message.jrsl==null){
				msg.message.jrsl=0
			}
			$('#apply_all').text(msg.message.jrls.toFixed(2));
			$('#error_all').text(msg.message.jryl.toFixed(2));
			$('#check_all').text(msg.message.jrtzcs);
			$('#inventory_all').text(msg.message.xzcwj);
			$('#pay_all').text(msg.message.jrcz.toFixed(2));
			$('#withdrawal_all').text(msg.message.jrtx.toFixed(2));
			$('#shenglv_all').text((parseFloat(msg.message.jrsl)*100).toFixed(2));
			$('#balance_all').text(msg.message.ye.toFixed(2));
		},
		error:function(err){
			layer.msg('登录过期，请刷新主页后重新登录！');
		}
	})
	
})
