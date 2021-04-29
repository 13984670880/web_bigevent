$(function() {
        // 调用 getUserInfo 获取用户基本信息
        getUserInfo();
        // 点击按钮实现退出功能
        var layer = layui.layer;
        $('#btnLogout').on('click', function() {
            // alert('成功退出！');
            // 提示用户是否确认退出
            layer.confirm('确定退出登录?', { icon: 3, title: '温馨提示！' }, function(index) {
                //do something
                // console.log('ok');
                // 1.清空本地存储的 token
                localStorage.removeItem('token');
                // 2.退出之后跳转到登录页面
                window.location.href = '/login.html';
                // 关闭 comfirm 询问框
                layer.close(index);
            });
        })
    })
    // 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头的配置对象
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: function(res) {
            // console.log(res);
            // 请求是否成功的状态
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            // renderAvatar 渲染用户的头像
            renderAvatar(res.data);
        },
        // 不论成功还是失败，最终都会调用 complete 回调函数
        // complete: function(res) {
        //     // console.log('执行了complete回调');
        //     // console.log(res);
        //     // 在 complete 回调函数中，可以使用 res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空 token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转到登录页面
        //         window.location.href = '/login.html';
        //     }

        // }
    })
}
//渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var userName = user.nickname || user.username;
    // 2.设置欢迎文本
    $('#welcome').html('欢迎&nbsp&nbsp' + userName);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = userName[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}