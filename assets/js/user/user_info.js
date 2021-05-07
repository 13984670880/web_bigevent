$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间!'
            }
        }
    });
    // 调用用户基本信息函数
    unitUserInfo();
    //初始化用户的基本信息
    function unitUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！', {
                        icon: 2,
                        time: 1500
                    })
                }
                // console.log(res);
                // 调用 from.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 调用用户基本信息函数从新获取用户数据
        unitUserInfo();
    });
    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起 Ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！', {
                        icon: 2,
                        time: 1500
                    })
                }
                layer.msg('更新用户信息成功！', {
                    icon: 1,
                    time: 1500
                });
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        })
    })
})