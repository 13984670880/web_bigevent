$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致!'
            }
        }
    });
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起 Ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('原密码不正确！', {
                        icon: 2,
                        time: 1500
                    })
                }
                layer.msg('密码修改成功！', {
                    icon: 1,
                    time: 1500
                });
                // 重置表单数据
                $('.layui-form')[0].reset();
            }
        })
    })
})