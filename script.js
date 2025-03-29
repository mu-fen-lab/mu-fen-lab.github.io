// 虚拟用户数据
const users = [
    { id: 1, name: '用户宋薇', avatar: 'images/1.jpg', balance: 800 },
    { id: 2, name: '用户徐莫缇', avatar: 'images/3.jpg', balance: 1200 },
    { id: 3, name: '用户江星眠', avatar: 'images/2.jpg', balance: 650 }
];

// 职位数据
const jobPositions = [
    { id: 1, title: 'AI数据标注员', salary: '5000-8000元/月', type: '全职/兼职', location: '远程' },
    { id: 2, title: '图像识别专员', salary: '8000-12000元/月', type: '全职', location: '北京' },
    { id: 3, title: '语音标注师', salary: '6000-9000元/月', type: '兼职', location: '远程' },
    { id: 4, title: '自然语言处理工程师', salary: '15000-25000元/月', type: '全职', location: '上海' },
    { id: 5, title: '机器学习算法专家', salary: '25000-35000元/月', type: '全职', location: '深圳' }
];

// 状态管理
let state = {
    currentUser: null,
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    withdrawStatus: localStorage.getItem('withdrawStatus') || 'pending',
    withdrawAttempts: parseInt(localStorage.getItem('withdrawAttempts')) || 0,
    notifications: [],
    selectedJob: null
};

// 初始化
function init() {
    console.log("初始化应用...");
    
    // 恢复登录状态
    if(state.isLoggedIn) {
        const storedUser = users.find(u => u.name === localStorage.getItem('username'));
        if(storedUser) {
            state.currentUser = storedUser;
            document.getElementById('userAvatar').src = storedUser.avatar;
            document.getElementById('username').textContent = storedUser.name;
        }
    }
    updateLoginState();
    updateWithdrawButton();
    
    // 加载职位列表 - 确保这个函数在DOM完全加载后执行
    console.log("开始加载职位列表...");
    loadJobPositions();
    
    // 设置导航动画
    setupNavAnimation();
    
    // 添加通知系统
    setupNotifications();
    
    // 设置反馈表单事件监听
    setupFeedbackForm();
    
    // 初始化视觉效果
    initVisualEffects();
    
    console.log("初始化完成");
}

// 加载职位列表
function loadJobPositions() {
    const jobSelect = document.getElementById('jobSelect');
    if (!jobSelect) {
        console.error('找不到职位选择元素');
        return;
    }
    
    // 如果已经有选项了，不需要再添加
    if (jobSelect.options.length > 0) {
        console.log('职位选项已存在，跳过添加');
        
        // 添加职位选择事件
        jobSelect.addEventListener('change', function() {
            const selectedId = parseInt(this.value);
            state.selectedJob = jobPositions.find(job => job.id === selectedId);
            updateJobDetails();
        });
        
        // 触发初始选择
        if (jobSelect.value) {
            const event = new Event('change');
            jobSelect.dispatchEvent(event);
        }
        
        return;
    }
    
    // 清空现有选项
    jobSelect.innerHTML = '';
    
    // 添加默认选项
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "请选择职位";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    jobSelect.appendChild(defaultOption);
    
    // 添加职位选项
    jobPositions.forEach(job => {
        const option = document.createElement('option');
        option.value = job.id;
        option.textContent = job.title;
        jobSelect.appendChild(option);
    });
    
    // 添加职位选择事件
    jobSelect.addEventListener('change', function() {
        const selectedId = parseInt(this.value);
        state.selectedJob = jobPositions.find(job => job.id === selectedId);
        updateJobDetails();
    });
}

// 更新职位详情
function updateJobDetails() {
    console.log("更新职位详情");
    const jobDetailsElement = document.getElementById('jobDetails');
    
    if (!jobDetailsElement) {
        console.error('找不到职位详情元素 #jobDetails');
        return;
    }
    
    if (!state.selectedJob) {
        console.error('未选择职位');
        return;
    }
    
    console.log("渲染职位详情:", state.selectedJob.title);
    
    jobDetailsElement.innerHTML = `
        <div class="card p-3 mb-3">
            <h5>${state.selectedJob.title}</h5>
            <div class="text-muted small mb-2">
                <span class="me-3"><i class="fas fa-money-bill-wave me-1"></i>${state.selectedJob.salary}</span>
                <span class="me-3"><i class="fas fa-briefcase me-1"></i>${state.selectedJob.type}</span>
                <span><i class="fas fa-map-marker-alt me-1"></i>${state.selectedJob.location}</span>
            </div>
            <div class="progress mt-2" style="height: 5px;">
                <div class="progress-bar bg-success" style="width: ${Math.floor(Math.random() * 70) + 30}%"></div>
            </div>
            <div class="text-end text-muted small mt-1">招聘进度</div>
        </div>
    `;
}

// 设置导航动画
function setupNavAnimation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动类
            navLinks.forEach(l => l.classList.remove('active'));
            
            // 添加活动类到当前链接
            this.classList.add('active');
            
            // 获取目标部分
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // 平滑滚动到目标部分
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 添加高亮动画
                targetSection.classList.add('section-highlight');
                setTimeout(() => {
                    targetSection.classList.remove('section-highlight');
                }, 1000);
            }
        });
    });
    
    // 监听滚动以更新活动导航链接
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const currentId = section.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// 设置通知系统
function setupNotifications() {
    // 创建通知容器
    if (!document.getElementById('notificationContainer')) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // 添加一些示例通知
    if (state.isLoggedIn) {
        setTimeout(() => {
            showNotification('您有一条新的系统消息', 'info');
        }, 3000);
        
        setTimeout(() => {
            showNotification('您的简历已被查看5次', 'success');
        }, 7000);
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        </div>
        <div class="notification-content">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    container.appendChild(notification);
    
    // 添加关闭按钮事件
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 自动关闭
    setTimeout(() => {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('notification-show');
    }, 10);
    
    // 保存到状态
    state.notifications.push({
        id: Date.now(),
        message,
        type,
        timestamp: new Date()
    });
}

// 设置反馈表单
function setupFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) return;
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const rating = document.querySelector('input[name="rating"]:checked');
        const comment = document.getElementById('feedbackComment').value;
        
        if (!rating) {
            showNotification('请选择评分', 'warning');
            return;
        }
        
        // 显示加载状态
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>提交中...';
        
        // 模拟提交
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // 重置表单
            this.reset();
            
            // 显示成功消息
            showNotification('感谢您的反馈！', 'success');
            
            // 关闭反馈模态框
            const feedbackModal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
            if (feedbackModal) {
                feedbackModal.hide();
            }
        }, 1500);
    });
}

// 登录功能
document.getElementById('loginBtn').addEventListener('click', () => {
    if(!state.isLoggedIn) {
        const user = users[Math.floor(Math.random() * users.length)];
        state.currentUser = user;
        state.isLoggedIn = true;
        
        // 存储状态
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('username', user.name);
        
        // 更新界面
        document.getElementById('userAvatar').src = user.avatar;
        document.getElementById('username').textContent = user.name;
        
        Swal.fire({
            icon: 'success',
            title: `欢迎回来，${user.name}!`,
            showConfirmButton: false,
            timer: 1500
        });
        
        updateLoginState();
        updateWithdrawButton();
        
        // 登录后显示通知
        setTimeout(() => {
            showNotification('登录成功，欢迎回来！', 'success');
        }, 1000);
    }
});

// 退出登录
document.getElementById('logoutBtn').addEventListener('click', () => {
    // 确认退出
    Swal.fire({
        title: '确定要退出登录吗？',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            state = {
                currentUser: null,
                isLoggedIn: false,
                withdrawStatus: 'pending',
                withdrawAttempts: 0,
                notifications: [],
                selectedJob: state.selectedJob
            };
            document.getElementById('userAvatar').src = 'images/default-avatar.jpg';
            document.getElementById('username').textContent = '';
            updateLoginState();
            updateWithdrawButton();
            Swal.fire({
                icon: 'success',
                title: '已退出登录！',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
});

// 提现功能
document.getElementById('withdrawBtn').addEventListener('click', () => {
    if (!state.isLoggedIn) {
        Swal.fire({
            icon: 'warning',
            title: '请先登录',
            confirmButtonText: '确定'
        });
        return;
    }

    if(state.withdrawStatus === 'success') return;

    // 显示提现确认
    Swal.fire({
        title: '确认提现',
        html: `
            <div class="text-start">
                <p>提现金额: <strong>¥${state.currentUser.balance}</strong></p>
                <p>收款方式: <select class="form-select mb-3">
                    <option>微信</option>
                    <option>支付宝</option>
                    <option>银行卡</option>
                </select></p>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="agreeTerms">
                    <label class="form-check-label" for="agreeTerms">
                        我同意《提现服务协议》
                    </label>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '确认提现',
        cancelButtonText: '取消',
        preConfirm: () => {
            const agreed = document.getElementById('agreeTerms').checked;
            if (!agreed) {
                Swal.showValidationMessage('请同意提现服务协议');
                return false;
            }
            return true;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // 显示加载状态
            Swal.fire({
                title: '处理中...',
                html: '<i class="fas fa-spinner fa-spin fa-2x"></i>',
                showConfirmButton: false,
                allowOutsideClick: false
            });
            
            // 模拟处理延迟
            setTimeout(() => {
                const isSuccess = Math.random() > 0.5;
                
                if(isSuccess) {
                    state.withdrawStatus = 'success';
                    localStorage.setItem('withdrawStatus', 'success');
                    showWithdrawResult(true);
                } else {
                    state.withdrawAttempts++;
                    localStorage.setItem('withdrawAttempts', state.withdrawAttempts);
                    showWithdrawResult(false);
                    
                    if(state.withdrawAttempts >= 3) {
                        Swal.fire({
                            title: '提现失败',
                            html: '请联系管理员处理<br><img src="wechat-qrcode.png" style="width:200px">',
                            icon: 'error'
                        });
                    }
                }
                
                updateWithdrawButton();
            }, 2000);
        }
    });
});

// 更新提现按钮状态
function updateWithdrawButton() {
    const btn = document.getElementById('withdrawBtn');
    if (!btn) return;
    
    // 更新余额显示
    const balanceElement = document.getElementById('userBalance');
    if (balanceElement && state.currentUser) {
        balanceElement.textContent = `¥${state.currentUser.balance}`;
    }
    
    if (!state.isLoggedIn) {
        btn.disabled = true;
        btn.innerHTML = '请先登录';
        btn.classList.remove('pulse', 'btn-success');
        btn.classList.add('btn-secondary');
        return;
    }

    if(state.withdrawStatus === 'success') {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-check-circle me-2"></i>已提现';
        btn.classList.remove('pulse', 'btn-success');
        btn.classList.add('btn-secondary');
    } else if(state.withdrawAttempts >= 3) {
        btn.disabled = true;
        btn.innerHTML = '提现功能已锁定';
        btn.classList.remove('pulse', 'btn-success');
        btn.classList.add('btn-danger');
    } else {
        btn.disabled = false;
        btn.innerHTML = `立即提现 ¥${state.currentUser ? state.currentUser.balance : 0}`;
        btn.classList.add('pulse', 'btn-success');
        btn.classList.remove('btn-secondary', 'btn-danger');
    }
}

// 辅助函数
function submitApplication() {
    if (!state.isLoggedIn) {
        Swal.fire({
            icon: 'warning',
            title: '请先登录',
            confirmButtonText: '确定'
        });
        return;
    }
    
    // 获取表单数据
    const jobSelect = document.getElementById('jobSelect');
    const resumeFile = document.getElementById('resumeFile');
    
    if (!jobSelect || !resumeFile) {
        showNotification('表单元素不存在', 'error');
        console.error('找不到表单元素:', !jobSelect ? 'jobSelect' : 'resumeFile');
        return;
    }
    
    // 检查是否选择了职位
    if (!jobSelect.value) {
        showNotification('请选择职位', 'warning');
        return;
    }
    
    // 确保state.selectedJob已设置
    if (!state.selectedJob) {
        const selectedId = parseInt(jobSelect.value);
        state.selectedJob = jobPositions.find(job => job.id === selectedId);
        console.log('已选择职位:', state.selectedJob);
    }
    
    if (!resumeFile.files.length) {
        showNotification('请上传简历', 'warning');
        return;
    }
    
    // 显示加载状态
    Swal.fire({
        title: '提交中...',
        html: '<i class="fas fa-spinner fa-spin fa-2x"></i>',
        showConfirmButton: false,
        allowOutsideClick: false
    });
    
    // 模拟上传延迟
    setTimeout(() => {
        // 随机生成申请编号
        const applicationId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        
        Swal.fire({
            icon: 'success',
            title: '申请已提交!',
            html: `
                <div class="text-start">
                    <p>申请编号: <strong>${applicationId}</strong></p>
                    <p>申请职位: <strong>${state.selectedJob ? state.selectedJob.title : '未知职位'}</strong></p>
                    <p>申请状态: <span class="badge bg-warning">审核中</span></p>
                    <hr>
                    <p>请扫码加入官方群查看进度</p>
                </div>
                <img src="wechat-qrcode.png" style="width:200px" class="mt-2">
            `,
            confirmButtonText: '确定'
        });
        
        // 添加到通知
        setTimeout(() => {
            showNotification('您的申请已提交成功，请等待审核', 'success');
        }, 1000);
    }, 2000);
}

function downloadQR() {
    const link = document.createElement('a');
    link.download = 'official-qrcode.png';
    link.href = 'wechat-qrcode.png';
    link.click();
    
    showNotification('二维码已下载', 'success');
}

function updateLoginState() {
    const userInfo = document.getElementById('userInfo');
    const loginBtn = document.getElementById('loginBtn');
    
    if(state.isLoggedIn) {
        userInfo.classList.remove('d-none');
        userInfo.classList.add('d-flex');
        loginBtn.classList.add('d-none');
        
        // 更新用户余额显示
        const balanceElement = document.getElementById('userBalance');
        if (balanceElement && state.currentUser) {
            balanceElement.textContent = `¥${state.currentUser.balance}`;
        }
    } else {
        userInfo.classList.add('d-none');
        userInfo.classList.remove('d-flex');
        loginBtn.classList.remove('d-none');
    }
}

function showWithdrawResult(isSuccess) {
    Swal.fire({
        icon: isSuccess ? 'success' : 'error',
        title: isSuccess ? '提现成功！' : '提现失败',
        text: isSuccess ? `${state.currentUser.balance}元已到账，请注意查收` : '请稍后再试或联系客服',
        timer: 2000,
        showConfirmButton: false
    });
    
    // 添加到通知
    showNotification(
        isSuccess ? `提现成功！${state.currentUser.balance}元已到账` : '提现失败，请稍后再试',
        isSuccess ? 'success' : 'error'
    );
}

// 打开反馈表单
function openFeedback() {
    // 检查是否已存在模态框
    let feedbackModal = document.getElementById('feedbackModal');
    
    if (!feedbackModal) {
        // 创建模态框
        const modalHTML = `
            <div class="modal fade" id="feedbackModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content bg-dark text-light">
                        <div class="modal-header">
                            <h5 class="modal-title">用户反馈</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="feedbackForm">
                                <div class="mb-3">
                                    <label class="form-label">您对我们的评分</label>
                                    <div class="rating-container">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="rating" id="rating1" value="1">
                                            <label class="form-check-label" for="rating1">1</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="rating" id="rating2" value="2">
                                            <label class="form-check-label" for="rating2">2</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="rating" id="rating3" value="3">
                                            <label class="form-check-label" for="rating3">3</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="rating" id="rating4" value="4">
                                            <label class="form-check-label" for="rating4">4</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="rating" id="rating5" value="5">
                                            <label class="form-check-label" for="rating5">5</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="feedbackComment" class="form-label">您的建议</label>
                                    <textarea class="form-control bg-dark text-light" id="feedbackComment" rows="3" placeholder="请输入您的建议或反馈..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">提交反馈</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加到文档
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        feedbackModal = document.getElementById('feedbackModal');
        
        // 设置反馈表单事件
        setupFeedbackForm();
    }
    
    // 显示模态框
    const modal = new bootstrap.Modal(feedbackModal);
    modal.show();
}

// 添加页面滚动动画
function handleScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// 添加鼠标跟随效果
function setupMouseFollowEffect() {
    const decorations = document.querySelectorAll('.floating-decoration');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        decorations.forEach((decoration, index) => {
            // 计算不同的移动速度，创造视差效果
            const speed = index === 0 ? 0.05 : 0.03;
            const x = (window.innerWidth / 2 - mouseX) * speed;
            const y = (window.innerHeight / 2 - mouseY) * speed;
            
            decoration.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// 添加文字渐变动画
function setupTextGradientAnimation() {
    const gradientTexts = document.querySelectorAll('.text-gradient');
    
    gradientTexts.forEach(text => {
        text.style.backgroundSize = '200% auto';
        text.style.animation = 'textGradientShift 3s linear infinite';
    });
}

// 添加卡片悬停效果增强
function enhanceCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 计算鼠标在卡片上的相对位置（百分比）
            const percentX = mouseX / rect.width;
            const percentY = mouseY / rect.height;
            
            // 根据鼠标位置设置卡片的倾斜角度
            const tiltX = (percentY - 0.5) * 5; // -2.5 到 2.5 度
            const tiltY = (percentX - 0.5) * -5; // -2.5 到 2.5 度
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
            card.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // 计算鼠标在卡片上的相对位置（百分比）
            const percentX = mouseX / rect.width;
            const percentY = mouseY / rect.height;
            
            // 根据鼠标位置设置卡片的倾斜角度
            const tiltX = (percentY - 0.5) * 5; // -2.5 到 2.5 度
            const tiltY = (percentX - 0.5) * -5; // -2.5 到 2.5 度
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.3s ease';
        });
    });
}

// 添加按钮点击波纹效果
function setupButtonRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 确保在DOM完全加载后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // 如果DOM已经加载完成，直接执行初始化
    init();
}

function initVisualEffects() {
    handleScrollAnimations();
    setupMouseFollowEffect();
    setupTextGradientAnimation();
    enhanceCardHoverEffects();
    setupButtonRippleEffect();
}

// 在DOM加载完成后初始化视觉效果
document.addEventListener('DOMContentLoaded', () => {
    initVisualEffects();
});


// 调试辅助函数
function debugElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        console.log(`找到元素 ${selector}:`, element);
        return true;
    } else {
        console.error(`找不到元素 ${selector}`);
        return false;
    }
}

// 添加一个手动初始化职位选择的函数，可以在控制台调用
window.initJobSelect = function() {
    console.log("手动初始化职位选择...");
    loadJobPositions();
};