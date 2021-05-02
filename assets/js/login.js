$(function() {
    // 绑定点击去注册账号的链接
    $('#login_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        // 绑定点击去登录的链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 密码验证规则
    // 从 layui 中获取 from 对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
            // 自定义了一个叫做 pwd 校验规则
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 校验两次密码是否一致的规则
            repwd: function(value) {
                // 通过形参拿到的是确认密码框的内容
                // 还需要拿到密码框的内容
                // 然后进行一次等于的判断
                // 如果判断失败，则return一个提示的消息框
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码不一致！';
                }
            }
        })
        // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单默认提事件
        e.preventDefault();
        // 请求注册 url 地址
        var url = '/api/reguser';
        // 发起请求，注册新用户
        $.post(url, $(this).serialize(), function(res) {
            // 请求是否成功，0：成功；1：失败
            if (res.status !== 0) {
                // 显示注册失败
                return layer.msg(res.message);
            }
            // 显示注册成功
            layer.msg('注册成功，请登录！');
            // 展示登录表单
            $('#link_login').click();
        })
    });
    // 监听登录表单提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
})