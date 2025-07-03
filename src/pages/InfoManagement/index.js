import React, { useState } from 'react';
import { Tabs, Form, Input, Button, ImageUploader, Toast, List, Avatar, Dialog, Card, SwipeAction, Collapse, Space, Empty, Switch, Radio, TextArea, Selector } from 'antd-mobile';
import { PictureOutline, RightOutline, UserOutline, ShopbagOutline, EnvironmentOutline, PhoneFill, MailOutline, LockOutline, AddOutline, DeleteOutline, EditOutline, PayCircleOutline, SetOutline, BellOutline, ExclamationCircleOutline } from 'antd-mobile-icons';
import './style.css';
import '../../styles/common.css';

const InfoManagement = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [businessLicenseFiles, setBusinessLicenseFiles] = useState([]);
  const [idCardFiles, setIdCardFiles] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phoneChangeVisible, setPhoneChangeVisible] = useState(false);
  const [emailChangeVisible, setEmailChangeVisible] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotification: true,
    paymentNotification: true,
    promotionNotification: false,
    systemNotification: true
  });
  const [contactPersons, setContactPersons] = useState([
    {
      id: 1,
      name: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      im: 'zhangsan_im',
      role: '管理员'
    }
  ]);
  const [financialInfos, setFinancialInfos] = useState([
    {
      id: 1,
      paymentChannel: '银行卡',
      accountNumber: '6222021234567890123',
      accountName: '张三',
      bankName: '中国工商银行'
    }
  ]);
  
  // 仓库信息
  const [warehouseInfo, setWarehouseInfo] = useState({
    province: '广东省',
    city: '深圳市',
    district: '宝安区',
    address: '西乡路123号贤基大厦1楼',
    contactPerson: '周杰伦',
    contactPhone: '13900139000',
    workingHours: '周一至周五 9:00-18:00',
    remarks: '节假日休息'
  });
  
  // 开票信息
  const [invoiceInfo, setInvoiceInfo] = useState({
    invoiceType: '增值税专用发票',
    invoiceTitle: '深圳新亚通物流有限公司',
    taxNumber: '91440101MAXXXXXXXX',
    // 增值税专用发票特有字段
    registeredAddress: '广东省深圳市宝安区上川路123号',
    contactPhone: '0755-12345678',
    bankName: '中国工商银行深圳高新园支行',
    bankAccount: '6222021234567890123',
    // 可选补充字段
    invoiceRemark: '',
    receiveMethod: '邮箱',
    email: 'invoice@ar-logistics.com.cn',
    mobile: '',
    mailingAddress: {
      province: '',
      city: '',
      district: '',
      address: '',
      recipient: '',
      recipientPhone: ''
    }
  });
  
  // 发票类型选项
  const invoiceTypeOptions = [
    { label: '增值税专用发票', value: '增值税专用发票' },
    { label: '增值税普通发票', value: '增值税普通发票' },
    { label: '电子普通发票', value: '电子普通发票' },
    { label: '纸质普通发票', value: '纸质普通发票' }
  ];
  
  // 接收方式选项
  const receiveMethodOptions = [
    { label: '邮箱', value: '邮箱' },
    { label: '手机号', value: '手机号' },
    { label: '邮寄地址', value: '邮寄地址' }
  ];
  
  // 模拟企业基本信息
  const companyInfo = {
    companyName: '深圳新亚通物流有限公司',
    registeredAddress: '广东省深圳市宝安区上川路123号',
    creditCode: '91440101MAXXXXXXXX',
    legalPersonName: '周杰伦',
    legalPersonIdCard: '440101199001011234',
  };
  
  // 模拟账户信息
  const accountInfo = {
    username: 'yuliang',
    phone: '13800138000',
    email: 'henry@ar-logistics.com.cn',
    lastLoginTime: '2025-06-15 14:30:22',
    lastLoginIp: '192.168.1.1',
  };
  
  // 模拟店铺列表数据
  const [shops, setShops] = useState([
    {
      id: 1,
      internalCode: '001',
      shopName: 'SUPER MILE',
      sellerId: 'BDAW8X20OU',
      country: '孟加拉',
      category: '服装',
      authStatus: '店铺已授权'
    },
    {
      id: 2,
      internalCode: '002',
      shopName: 'SastaBaha',
      sellerId: 'PK2NBX0M54H',
      country: '巴基斯坦',
      category: '文具',
      authStatus: '店铺已授权'
    }
  ]);
  
  // 授权对话框状态
  const [authDialogVisible, setAuthDialogVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('孟加拉');
  
  // 国家选项
  const countryOptions = [
    { label: '孟加拉', value: '孟加拉' },
    { label: '巴基斯坦', value: '巴基斯坦' },
    { label: '斯里兰卡', value: '斯里兰卡' },
    { label: '尼泊尔', value: '尼泊尔' }
  ];


  // 模拟图片上传
  const mockUpload = async (file) => {
    return {
      url: URL.createObjectURL(file),
    };
  };

  const handleUpdateCompanyInfo = (values) => {
    console.log('更新企业基本信息:', { 
      ...values, 
      businessLicense: businessLicenseFiles,
      idCard: idCardFiles
    });
    Toast.show({
      icon: 'success',
      content: '企业信息更新成功',
    });
    // 这里应该有实际的更新逻辑
  };
  
  // 更新仓库信息
  const handleUpdateWarehouseInfo = (values) => {
    console.log('更新仓库信息:', values);
    setWarehouseInfo(values);
    Toast.show({
      icon: 'success',
      content: '仓库信息更新成功',
    });
    // 这里应该有实际的更新逻辑
  };
  
  // 更新开票信息
  const handleUpdateInvoiceInfo = (values) => {
    console.log('更新开票信息:', values);
    setInvoiceInfo(values);
    Toast.show({
      icon: 'success',
      content: '开票信息更新成功',
    });
    // 这里应该有实际的更新逻辑
  };
  
  // 处理发票类型变更
  const handleInvoiceTypeChange = (value) => {
    // 如果不是增值税专用发票，清空专用发票特有字段
    if (value !== '增值税专用发票') {
      setInvoiceInfo(prev => ({
        ...prev,
        invoiceType: value,
        // 清空专用发票特有字段
        registeredAddress: '',
        contactPhone: '',
        bankName: '',
        bankAccount: ''
      }));
    } else {
      setInvoiceInfo(prev => ({
        ...prev,
        invoiceType: value
      }));
    }
  };
  
  // 处理接收方式变更
  const handleReceiveMethodChange = (value) => {
    // 根据接收方式清空不相关的字段
    if (value === '邮箱') {
      setInvoiceInfo(prev => ({
        ...prev,
        receiveMethod: value,
        mobile: '',
        mailingAddress: {
          province: '',
          city: '',
          district: '',
          address: '',
          recipient: '',
          recipientPhone: ''
        }
      }));
    } else if (value === '手机号') {
      setInvoiceInfo(prev => ({
        ...prev,
        receiveMethod: value,
        email: '',
        mailingAddress: {
          province: '',
          city: '',
          district: '',
          address: '',
          recipient: '',
          recipientPhone: ''
        }
      }));
    } else if (value === '邮寄地址') {
      setInvoiceInfo(prev => ({
        ...prev,
        receiveMethod: value,
        email: '',
        mobile: ''
      }));
    }
  };
  
  // 打开授权对话框
  const handleOpenAuthDialog = () => {
    setAuthDialogVisible(true);
  };
  
  // 处理授权
  const handleAuthorize = () => {
    // 根据不同国家跳转到不同授权链接
    const authLinks = {
      '孟加拉': 'https://seller.example.com/bd/auth',
      '巴基斯坦': 'https://seller.example.com/pk/auth',
      '斯里兰卡': 'https://seller.example.com/lk/auth',
      '尼泊尔': 'https://seller.example.com/np/auth'
    };
    
    console.log(`跳转到${selectedCountry}授权链接: ${authLinks[selectedCountry]}`);
    // 实际项目中应该跳转到对应的授权页面
    // window.location.href = authLinks[selectedCountry];
    
    // 模拟授权成功
    Toast.show({
      icon: 'success',
      content: '授权请求已发送',
    });
    setAuthDialogVisible(false);
  };
  
  // 取消店铺授权
  const handleCancelAuth = (shopId) => {
    Dialog.confirm({
      title: '取消授权',
      content: '确定要取消该店铺的授权吗？取消授权操作会立即生效，不再获取订单数据，不再执行RTS自动发货，请谨慎操作！',
      onConfirm: () => {
        // 实际项目中应该调用API取消授权
        const updatedShops = shops.map(shop => 
          shop.id === shopId ? { ...shop, authStatus: '未授权' } : shop
        );
        setShops(updatedShops);
        Toast.show({
          icon: 'success',
          content: '已取消店铺授权',
        });
      },
    });
  };
  
  // 重新授权店铺
  const handleReauthorize = (shopId) => {
    // 获取店铺信息
    const shop = shops.find(shop => shop.id === shopId);
    if (shop) {
      // 设置选中的国家
      setSelectedCountry(shop.country);
      // 打开授权对话框
      setAuthDialogVisible(true);
    }
  };
  
  // 编辑店铺信息
  const handleEditShop = (shop) => {
    Dialog.show({
      title: '编辑店铺信息',
      content: (
        <Form
          layout="horizontal"
          initialValues={{
            internalCode: shop.internalCode,
            category: shop.category
          }}
          onFinish={(values) => {
            const updatedShops = shops.map(item => 
              item.id === shop.id ? { ...item, ...values } : item
            );
            setShops(updatedShops);
            Dialog.clear();
            Toast.show({
              icon: 'success',
              content: '店铺信息更新成功',
            });
          }}
          footer={
            <Button block type="submit" color="primary">
              确认
            </Button>
          }
        >
          <Form.Item name="internalCode" label="内部编号" rules={[{ required: true }]}>
            <Input placeholder="请输入内部编号" />
          </Form.Item>
          <Form.Item name="category" label="经营品类" rules={[{ required: true }]}>
            <Input placeholder="请输入经营品类" />
          </Form.Item>
        </Form>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'cancel',
          text: '取消',
        },
      ],
    });
  };
  
  // 添加联系人
  const handleAddContactPerson = () => {
    Dialog.show({
      title: '添加联系人',
      content: (
        <Form
          layout="horizontal"
          onFinish={(values) => {
            const newContact = {
              id: Date.now(),
              ...values
            };
            setContactPersons([...contactPersons, newContact]);
            Dialog.clear();
            Toast.show({
              icon: 'success',
              content: '联系人添加成功',
            });
          }}
          footer={
            <Button block type="submit" color="primary">
              确认
            </Button>
          }
        >
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人手机号" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人邮箱" />
          </Form.Item>
          <Form.Item name="im" label="即时通号" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人即时通号" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人角色" />
          </Form.Item>
        </Form>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'cancel',
          text: '取消',
        },
      ],
    });
  };
  
  // 编辑联系人
  const handleEditContactPerson = (contact) => {
    Dialog.show({
      title: '编辑联系人',
      content: (
        <Form
          layout="horizontal"
          initialValues={contact}
          onFinish={(values) => {
            const updatedContacts = contactPersons.map(item => 
              item.id === contact.id ? { ...item, ...values } : item
            );
            setContactPersons(updatedContacts);
            Dialog.clear();
            Toast.show({
              icon: 'success',
              content: '联系人更新成功',
            });
          }}
          footer={
            <Button block type="submit" color="primary">
              确认
            </Button>
          }
        >
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人手机号" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人邮箱" />
          </Form.Item>
          <Form.Item name="im" label="即时通号" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人即时通号" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Input placeholder="请输入联系人角色" />
          </Form.Item>
        </Form>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'cancel',
          text: '取消',
        },
      ],
    });
  };
  
  // 删除联系人
  const handleDeleteContactPerson = (id) => {
    Dialog.confirm({
      title: '确认删除',
      content: '确定要删除此联系人吗？',
      onConfirm: () => {
        const updatedContacts = contactPersons.filter(item => item.id !== id);
        setContactPersons(updatedContacts);
        Toast.show({
          icon: 'success',
          content: '联系人已删除',
        });
      },
    });
  };
  
  // 添加财务信息
  const handleAddFinancialInfo = () => {
    Dialog.show({
      title: '添加财务信息',
      content: (
        <Form
          layout="horizontal"
          onFinish={(values) => {
            const newFinancialInfo = {
              id: Date.now(),
              ...values
            };
            setFinancialInfos([...financialInfos, newFinancialInfo]);
            Dialog.clear();
            Toast.show({
              icon: 'success',
              content: '财务信息添加成功',
            });
          }}
          footer={
            <Button block type="submit" color="primary">
              确认
            </Button>
          }
        >
          <Form.Item name="paymentChannel" label="支付渠道" rules={[{ required: true }]}>
            <Input placeholder="银行卡或支付宝" />
          </Form.Item>
          <Form.Item name="accountNumber" label="账号" rules={[{ required: true }]}>
            <Input placeholder="请输入银行卡号或支付宝账号" />
          </Form.Item>
          <Form.Item name="accountName" label="账户名" rules={[{ required: true }]}>
            <Input placeholder="请输入账户名" />
          </Form.Item>
          <Form.Item name="bankName" label="开户行" rules={[{ required: true }]}>
            <Input placeholder="请输入开户行（支付宝可不填）" />
          </Form.Item>
        </Form>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'cancel',
          text: '取消',
        },
      ],
    });
  };
  
  // 编辑财务信息
  const handleEditFinancialInfo = (financialInfo) => {
    Dialog.show({
      title: '编辑财务信息',
      content: (
        <Form
          layout="horizontal"
          initialValues={financialInfo}
          onFinish={(values) => {
            const updatedFinancialInfos = financialInfos.map(item => 
              item.id === financialInfo.id ? { ...item, ...values } : item
            );
            setFinancialInfos(updatedFinancialInfos);
            Dialog.clear();
            Toast.show({
              icon: 'success',
              content: '财务信息更新成功',
            });
          }}
          footer={
            <Button block type="submit" color="primary">
              确认
            </Button>
          }
        >
          <Form.Item name="paymentChannel" label="支付渠道" rules={[{ required: true }]}>
            <Input placeholder="银行卡或支付宝" />
          </Form.Item>
          <Form.Item name="accountNumber" label="账号" rules={[{ required: true }]}>
            <Input placeholder="请输入银行卡号或支付宝账号" />
          </Form.Item>
          <Form.Item name="accountName" label="账户名" rules={[{ required: true }]}>
            <Input placeholder="请输入账户名" />
          </Form.Item>
          <Form.Item name="bankName" label="开户行" rules={[{ required: true }]}>
            <Input placeholder="请输入开户行（支付宝可不填）" />
          </Form.Item>
        </Form>
      ),
      closeOnAction: true,
      actions: [
        {
          key: 'cancel',
          text: '取消',
        },
      ],
    });
  };
  
  // 删除财务信息
  const handleDeleteFinancialInfo = (id) => {
    Dialog.confirm({
      title: '确认删除',
      content: '确定要删除此财务信息吗？',
      onConfirm: () => {
        const updatedFinancialInfos = financialInfos.filter(item => item.id !== id);
        setFinancialInfos(updatedFinancialInfos);
        Toast.show({
          icon: 'success',
          content: '财务信息已删除',
        });
      },
    });
  };
  
  // 修改密码
  const handleChangePassword = () => {
    setPasswordVisible(true);
  };
  
  const handlePasswordSubmit = (values) => {
    if (values.newPassword !== values.confirmPassword) {
      Toast.show({
        icon: 'fail',
        content: '两次输入的新密码不一致',
      });
      return;
    }
    
    // 模拟密码修改请求
    console.log('修改密码:', values);
    setPasswordVisible(false);
    Toast.show({
      icon: 'success',
      content: '密码修改成功',
    });
  };
  
  // 修改手机号
  const handleChangePhone = () => {
    setPhoneChangeVisible(true);
  };
  
  const handlePhoneSubmit = (values) => {
    // 模拟手机号修改请求
    console.log('修改手机号:', values);
    setPhoneChangeVisible(false);
    Toast.show({
      icon: 'success',
      content: '手机号修改成功',
    });
  };
  
  // 修改邮箱
  const handleChangeEmail = () => {
    setEmailChangeVisible(true);
  };
  
  const handleEmailSubmit = (values) => {
    // 模拟邮箱修改请求
    console.log('修改邮箱:', values);
    setEmailChangeVisible(false);
    Toast.show({
      icon: 'success',
      content: '邮箱修改成功',
    });
  };
  
  // 更新通知设置
  const handleNotificationChange = (key, checked) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: checked
    }));
    Toast.show({
      icon: 'success',
      content: '设置已更新',
    });
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="info-container">
      <div className="info-header page-header">
        <div className="back-icon" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4166 14.6673L17.4166 22.0007L27.4166 29.334" stroke="currentColor" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>信息管理</h2>
        <div className="placeholder"></div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="企业信息" key="company">
          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel key="1" title="基本信息">
              <Form
                layout="horizontal"
                initialValues={companyInfo}
                onFinish={handleUpdateCompanyInfo}
                footer={
                  <Button block type="submit" color="primary" size="large">
                    保存
                  </Button>
                }
              >
                <Form.Item
                  name="companyName"
                  label="公司名称"
                  rules={[{ required: true, message: '请输入公司名称' }]}
                >
                  <Input placeholder="请输入公司名称" />
                </Form.Item>

                <Form.Item
                  name="registeredAddress"
                  label="注册地址"
                  rules={[{ required: true, message: '请输入注册地址' }]}
                >
                  <Input placeholder="请输入注册地址" />
                </Form.Item>

                <Form.Item
                  name="creditCode"
                  label="统一社会信用代码"
                  rules={[{ required: true, message: '请输入统一社会信用代码' }]}
                >
                  <Input placeholder="请输入统一社会信用代码" />
                </Form.Item>

                <Form.Item
                  name="legalPersonName"
                  label="法人姓名"
                  rules={[{ required: true, message: '请输入法人姓名' }]}
                >
                  <Input placeholder="请输入法人姓名" />
                </Form.Item>

                <Form.Item
                  name="legalPersonIdCard"
                  label="法人身份证"
                  rules={[{ required: true, message: '请输入法人身份证号码' }]}
                >
                  <Input placeholder="请输入法人身份证号码" />
                </Form.Item>

                <Form.Item
                  label="营业执照副本"
                  rules={[{ required: true, message: '请上传营业执照副本' }]}
                >
                  <ImageUploader
                    value={businessLicenseFiles}
                    onChange={setBusinessLicenseFiles}
                    upload={mockUpload}
                    multiple={false}
                    maxCount={1}
                    showUpload={businessLicenseFiles.length < 1}
                    beforeUpload={(file) => {
                      if (file.size > 10 * 1024 * 1024) {
                        Toast.show('图片大小不能超过10MB');
                        return null;
                      }
                      return file;
                    }}
                  >
                    <div className="upload-button">
                      <PictureOutline fontSize={24} />
                      <span>上传营业执照副本</span>
                    </div>
                  </ImageUploader>
                </Form.Item>

                <Form.Item
                  label="法人身份证"
                  rules={[{ required: true, message: '请上传法人身份证照片' }]}
                >
                  <ImageUploader
                    value={idCardFiles}
                    onChange={setIdCardFiles}
                    upload={mockUpload}
                    multiple={false}
                    maxCount={2}
                    showUpload={idCardFiles.length < 2}
                    beforeUpload={(file) => {
                      if (file.size > 10 * 1024 * 1024) {
                        Toast.show('图片大小不能超过10MB');
                        return null;
                      }
                      return file;
                    }}
                  >
                    <div className="upload-button">
                      <PictureOutline fontSize={24} />
                      <span>上传法人身份证照片（正反面）</span>
                    </div>
                  </ImageUploader>
                </Form.Item>
              </Form>
            </Collapse.Panel>
            
            <Collapse.Panel key="2" title="联系人信息">
              <div className="section-header">
                <h4>联系人列表</h4>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={handleAddContactPerson}
                >
                  <Space>
                    <AddOutline />
                    <span>添加联系人</span>
                  </Space>
                </Button>
              </div>
              
              {contactPersons.length > 0 ? (
                <List className="contact-list">
                  {contactPersons.map((contact) => (
                    <SwipeAction
                      key={contact.id}
                      rightActions={[
                        {
                          key: 'edit',
                          text: '编辑',
                          color: 'primary',
                          onClick: () => handleEditContactPerson(contact)
                        },
                        {
                          key: 'delete',
                          text: '删除',
                          color: 'danger',
                          onClick: () => handleDeleteContactPerson(contact.id)
                        }
                      ]}
                    >
                      <List.Item>
                        <Card className="contact-card">
                          <div className="contact-info">
                            <div className="contact-name">
                              <UserOutline /> {contact.name}
                              <span className="contact-role">{contact.role}</span>
                            </div>
                            <div className="contact-details">
                              <div><PhoneFill /> {contact.phone}</div>
                              <div><MailOutline /> {contact.email}</div>
                              <div><ShopbagOutline /> 即时通号: {contact.im}</div>
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    </SwipeAction>
                  ))}
                </List>
              ) : (
                <Empty
                  description="暂无联系人信息"
                  imageStyle={{ width: 128 }}
                />
              )}
              <div className="section-tip">
                <p>左滑联系人卡片可进行编辑或删除操作</p>
              </div>
            </Collapse.Panel>
            
            <Collapse.Panel key="3" title="财务信息">
              <div className="section-header">
                <h4>财务信息列表</h4>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={handleAddFinancialInfo}
                >
                  <Space>
                    <AddOutline />
                    <span>添加财务信息</span>
                  </Space>
                </Button>
              </div>
              
              {financialInfos.length > 0 ? (
                <List className="financial-list">
                  {financialInfos.map((info) => (
                    <SwipeAction
                      key={info.id}
                      rightActions={[
                        {
                          key: 'edit',
                          text: '编辑',
                          color: 'primary',
                          onClick: () => handleEditFinancialInfo(info)
                        },
                        {
                          key: 'delete',
                          text: '删除',
                          color: 'danger',
                          onClick: () => handleDeleteFinancialInfo(info.id)
                        }
                      ]}
                    >
                      <List.Item>
                        <Card className="financial-card">
                          <div className="financial-info">
                            <div className="financial-type">
                              <PayCircleOutline /> {info.paymentChannel}
                            </div>
                            <div className="financial-details">
                              <div>账号: {info.accountNumber}</div>
                              <div>账户名: {info.accountName}</div>
                              {info.bankName && <div>开户行: {info.bankName}</div>}
                            </div>
                          </div>
                        </Card>
                      </List.Item>
                    </SwipeAction>
                  ))}
                </List>
              ) : (
                <Empty
                  description="暂无财务信息"
                  imageStyle={{ width: 128 }}
                />
              )}
              <div className="section-tip">
                <p>左滑财务信息卡片可进行编辑或删除操作</p>
              </div>
            </Collapse.Panel>
            
            <Collapse.Panel key="4" title="仓库信息">
              <Form
                layout="horizontal"
                initialValues={warehouseInfo}
                onFinish={handleUpdateWarehouseInfo}
                footer={
                  <Button block type="submit" color="primary" size="large">
                    保存
                  </Button>
                }
              >
                <div className="address-group">
                  <Form.Item
                    name="province"
                    label="省份"
                    rules={[{ required: true, message: '请输入省份' }]}
                  >
                    <Input placeholder="请输入省份" />
                  </Form.Item>
                  
                  <Form.Item
                    name="city"
                    label="城市"
                    rules={[{ required: true, message: '请输入城市' }]}
                  >
                    <Input placeholder="请输入城市" />
                  </Form.Item>
                  
                  <Form.Item
                    name="district"
                    label="区/县"
                    rules={[{ required: true, message: '请输入区/县' }]}
                  >
                    <Input placeholder="请输入区/县" />
                  </Form.Item>
                </div>
                
                <Form.Item
                  name="address"
                  label="详细地址"
                  rules={[{ required: true, message: '请输入详细地址' }]}
                >
                  <Input placeholder="请输入详细地址" />
                </Form.Item>
                
                <Form.Item
                  name="contactPerson"
                  label="联系人"
                  rules={[{ required: true, message: '请输入联系人姓名' }]}
                >
                  <Input placeholder="请输入联系人姓名" />
                </Form.Item>
                
                <Form.Item
                  name="contactPhone"
                  label="联系电话"
                  rules={[{ required: true, message: '请输入联系电话' }]}
                >
                  <Input placeholder="请输入联系电话" />
                </Form.Item>
                
                <Form.Item
                  name="workingHours"
                  label="工作时间"
                  rules={[{ required: true, message: '请输入工作时间' }]}
                >
                  <Input placeholder="例如：周一至周五 9:00-18:00" />
                </Form.Item>
                
                <Form.Item
                  name="remarks"
                  label="备注"
                >
                  <TextArea
                    placeholder="请输入备注信息"
                    rows={3}
                    maxLength={200}
                    showCount
                  />
                </Form.Item>
              </Form>
            </Collapse.Panel>
            
            <Collapse.Panel key="5" title="开票信息">
              <Form
                layout="horizontal"
                initialValues={invoiceInfo}
                onFinish={handleUpdateInvoiceInfo}
                footer={
                  <Button block type="submit" color="primary" size="large">
                    保存
                  </Button>
                }
              >
                <div className="section-title">基础信息</div>
                
                <Form.Item
                  name="invoiceType"
                  label="发票类型"
                  rules={[{ required: true, message: '请选择发票类型' }]}
                >
                  <Selector
                    options={invoiceTypeOptions}
                    onChange={handleInvoiceTypeChange}
                    showCheckMark={false}
                  />
                </Form.Item>
                
                <Form.Item
                  name="title"
                  label="发票抬头"
                  rules={[{ required: true, message: '请输入发票抬头' }]}
                >
                  <Input placeholder="个人填写姓名，单位需与营业执照名称一致" />
                </Form.Item>
                
                <Form.Item
                  name="taxNumber"
                  label="税号/统一社会信用代码"
                  rules={[
                    { required: true, message: '请输入税号/统一社会信用代码' },
                    { pattern: /^[0-9A-Z]{18}$/, message: '格式为18位数字/字母组合' }
                  ]}
                >
                  <Input placeholder="请输入18位税号/统一社会信用代码" />
                </Form.Item>
                
                {invoiceInfo.invoiceType === '增值税专用发票' && (
                  <>
                    <div className="section-title">增值税专用发票信息</div>
                    
                    <Form.Item
                      name="registeredAddress"
                      label="注册地址"
                      rules={[{ required: true, message: '请输入注册地址' }]}
                    >
                      <Input placeholder="请输入与营业执照一致的注册地址" />
                    </Form.Item>
                    
                    <Form.Item
                      name="contactPhone"
                      label="联系电话"
                      rules={[{ required: true, message: '请输入联系电话' }]}
                    >
                      <Input placeholder="请输入单位公开的联系电话" />
                    </Form.Item>
                    
                    <Form.Item
                      name="bankName"
                      label="开户银行"
                      rules={[{ required: true, message: '请输入开户银行' }]}
                    >
                      <Input placeholder="请输入对公账户的开户银行全称" />
                    </Form.Item>
                    
                    <Form.Item
                      name="bankAccount"
                      label="银行账号"
                      rules={[
                        { required: true, message: '请输入银行账号' },
                        { pattern: /^\d+$/, message: '银行账号只能包含数字' }
                      ]}
                    >
                      <Input placeholder="请输入对公账户的银行账号" />
                    </Form.Item>
                  </>
                )}
                
                <div className="section-title">补充信息</div>
                
                <Form.Item
                  name="remark"
                  label="发票备注"
                >
                  <Input placeholder="可填写需要在发票上显示的特殊说明" />
                </Form.Item>
                
                <Form.Item
                  name="receiveMethod"
                  label="接收方式"
                >
                  <Selector
                    options={receiveMethodOptions}
                    onChange={handleReceiveMethodChange}
                    showCheckMark={false}
                  />
                </Form.Item>
                
                {invoiceInfo.receiveMethod === '电子邮箱' && (
                  <Form.Item
                    name="email"
                    label="接收邮箱"
                    rules={[
                      { required: true, message: '请输入接收邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input placeholder="请输入接收电子发票的邮箱地址" />
                  </Form.Item>
                )}
                
                {invoiceInfo.receiveMethod === '手机号码' && (
                  <Form.Item
                    name="mobile"
                    label="接收手机号"
                    rules={[
                      { required: true, message: '请输入接收手机号' },
                      { pattern: /^1\d{10}$/, message: '请输入有效的手机号码' }
                    ]}
                  >
                    <Input placeholder="请输入接收电子发票的手机号码" />
                  </Form.Item>
                )}
                
                {invoiceInfo.receiveMethod === '邮寄地址' && (
                  <>
                    <div className="address-group">
                      <Form.Item
                        name="mailProvince"
                        label="省份"
                        rules={[{ required: true, message: '请输入省份' }]}
                      >
                        <Input placeholder="请输入省份" />
                      </Form.Item>
                      
                      <Form.Item
                        name="mailCity"
                        label="城市"
                        rules={[{ required: true, message: '请输入城市' }]}
                      >
                        <Input placeholder="请输入城市" />
                      </Form.Item>
                      
                      <Form.Item
                        name="mailDistrict"
                        label="区/县"
                        rules={[{ required: true, message: '请输入区/县' }]}
                      >
                        <Input placeholder="请输入区/县" />
                      </Form.Item>
                    </div>
                    
                    <Form.Item
                      name="mailAddress"
                      label="详细地址"
                      rules={[{ required: true, message: '请输入详细地址' }]}
                    >
                      <Input placeholder="请输入详细地址" />
                    </Form.Item>
                    
                    <Form.Item
                      name="mailRecipient"
                      label="收件人"
                      rules={[{ required: true, message: '请输入收件人姓名' }]}
                    >
                      <Input placeholder="请输入收件人姓名" />
                    </Form.Item>
                    
                    <Form.Item
                      name="mailContactPhone"
                      label="联系电话"
                      rules={[
                        { required: true, message: '请输入联系电话' },
                        { pattern: /^1\d{10}$/, message: '请输入有效的手机号码' }
                      ]}
                    >
                      <Input placeholder="请输入收件人联系电话" />
                    </Form.Item>
                  </>
                )}
              </Form>
              
              <div className="section-tip">
                <p>提示：请确保发票信息准确无误，发票一经开具不可修改</p>
              </div>
            </Collapse.Panel>
          </Collapse>
        </Tabs.Tab>

        <Tabs.Tab title="店铺授权" key="shop">
          <div className="shop-auth-container">
            <div className="section-header">
              <h4>店铺列表</h4>
              <Button 
                size="small" 
                color="primary" 
                onClick={handleOpenAuthDialog}
              >
                <Space>
                  <AddOutline />
                  <span>授权新店铺</span>
                </Space>
              </Button>
            </div>
            
            {shops.length > 0 ? (
              <List className="shop-list">
                {shops.map((shop) => (
                  <List.Item
                    key={shop.id}
                    prefix={<ShopbagOutline />}
                    extra={
                      shop.authStatus === '店铺已授权' ? (
                        <Button 
                          size="small" 
                          color="danger"
                          onClick={() => handleCancelAuth(shop.id)}
                        >
                          取消授权
                        </Button>
                      ) : (
                        <Button 
                          size="small" 
                          color="primary"
                          onClick={() => handleReauthorize(shop.id)}
                        >
                          店铺授权
                        </Button>
                      )
                    }
                    onClick={() => handleEditShop(shop)}
                  >
                    <div className="shop-item">
                      <div className="shop-title">
                        <span className="shop-name">{shop.shopName}</span>
                        <span className="shop-code">内部编号: {shop.internalCode}</span>
                      </div>
                      <div className="shop-details">
                        <div className="shop-detail-item">
                          <span className="label">Seller ID:</span>
                          <span className="value">{shop.sellerId}</span>
                        </div>
                        <div className="shop-detail-item">
                          <span className="label">国家:</span>
                          <span className="value">{shop.country}</span>
                        </div>
                        <div className="shop-detail-item">
                          <span className="label">经营品类:</span>
                          <span className="value">{shop.category}</span>
                        </div>
                        <div className="shop-detail-item">
                          <span className="label">授权状态:</span>
                          <span className={`value status ${shop.authStatus === '店铺已授权' ? 'active' : 'inactive'}`}>
                            {shop.authStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                ))}
              </List>
            ) : (
              <Empty
                description="暂无店铺信息"
                imageStyle={{ width: 128 }}
              />
            )}
            
            <div className="section-tip">
              <p>点击店铺可编辑内部编号和经营品类</p>
            </div>
            
            <div className="auth-instructions">
              <h4>说明：</h4>
              <ol>
                <li>
                  <strong>店铺授权：</strong>点击按钮"授权新店铺"，跳转到Daraz平台授权页面，输入Daraz店铺登录名和密码进行授权，授权成功后，ARL系统可获取该店铺的订单及订单相关数据、获得订单自动RTS授权，以便在ARL系统中查看订单相关信息。
                </li>
                <li>
                  <strong>取消店铺授权：</strong>"店铺授权"成功后，店铺的授权状态显示为"店铺已授权"，点击操作列按钮"取消授权"，可随时取消该店铺的授权。取消店铺授权操作会立即生效，不再获取订单数据，不再执行RTS自动发货，取消授权后商家需要到Daraz商家后台查看订单进行操作，请谨慎操作！点击弹窗中的"确认"按钮后，店铺的授权状态显示为"未授权"。
                </li>
              </ol>
            </div>
          </div>
          
          <Dialog
            visible={authDialogVisible}
            title="选择店铺所属国家"
            content={
              <div className="auth-dialog-content">
                <p>请选择要授权的店铺所属国家：</p>
                <Radio.Group
                  value={selectedCountry}
                  onChange={val => setSelectedCountry(val)}
                >
                  {countryOptions.map(option => (
                    <Radio key={option.value} value={option.value}>{option.label}</Radio>
                  ))}
                </Radio.Group>
              </div>
            }
            closeOnAction
            onClose={() => setAuthDialogVisible(false)}
            actions={[
              {
                key: 'cancel',
                text: '取消',
              },
              {
                key: 'confirm',
                text: '确认并授权',
                bold: true,
                danger: false,
                onClick: handleAuthorize,
              },
            ]}
          />
        </Tabs.Tab>
        
        <Tabs.Tab title="账户设置" key="account">
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Collapse.Panel key="1" title="账户信息">
              <List className="account-list">
                <List.Item extra={accountInfo.username}>用户名</List.Item>
                <List.Item 
                  extra={accountInfo.phone}
                  clickable
                  onClick={handleChangePhone}
                  arrow={<RightOutline />}
                >
                  手机号
                </List.Item>
                <List.Item 
                  extra={accountInfo.email}
                  clickable
                  onClick={handleChangeEmail}
                  arrow={<RightOutline />}
                >
                  邮箱
                </List.Item>
                <List.Item 
                  clickable
                  onClick={handleChangePassword}
                  arrow={<RightOutline />}
                >
                  修改密码
                </List.Item>
              </List>
              
              <div className="login-info">
                <p>上次登录时间: {accountInfo.lastLoginTime}</p>
                <p>上次登录IP: {accountInfo.lastLoginIp}</p>
              </div>
            </Collapse.Panel>
            
            <Collapse.Panel key="2" title="通知设置" extra={<span className="section-tip">开通表示允许系统发送短信到注册手机</span>}>
              <List className="notification-list">
                <List.Item 
                  extra={
                    <Switch 
                      checked={notificationSettings.orderNotification}
                      onChange={(checked) => handleNotificationChange('orderNotification', checked)}
                    />
                  }
                >
                  <Space>
                    <BellOutline />
                    <span>审核结果通知</span>
                  </Space>
                </List.Item>
                <List.Item 
                  extra={
                    <Switch 
                      checked={notificationSettings.paymentNotification}
                      onChange={(checked) => handleNotificationChange('paymentNotification', checked)}
                    />
                  }
                >
                  <Space>
                    <PayCircleOutline />
                    <span>订单时效提醒</span>
                  </Space>
                </List.Item>

                <List.Item 
                  extra={
                    <Switch 
                      checked={notificationSettings.systemNotification}
                      onChange={(checked) => handleNotificationChange('systemNotification', checked)}
                    />
                  }
                >
                  <Space>
                    <SetOutline />
                    <span>系统通知</span>
                  </Space>
                </List.Item>
              </List>
            </Collapse.Panel>
            
            <Collapse.Panel key="3" title="安全设置">
              <List className="security-list">
                <List.Item 
                  extra={<span className="security-status active">已开启</span>}
                  clickable
                  arrow={<RightOutline />}
                >
                  <Space>
                    <LockOutline />
                    <span>登录验证</span>
                  </Space>
                </List.Item>
                <List.Item 
                  extra={<span className="security-status inactive">未开启</span>}
                  clickable
                  arrow={<RightOutline />}
                >
                  <Space>
                    <ExclamationCircleOutline />
                    <span>操作验证</span>
                  </Space>
                </List.Item>
              </List>
              
              <div className="section-tip">
                <p>提示：建议开启操作验证，提高账户安全性</p>
              </div>
            </Collapse.Panel>
          </Collapse>
        </Tabs.Tab>
      </Tabs>
      
      {/* 修改密码弹窗 */}
      <Dialog
        visible={passwordVisible}
        title="修改密码"
        content={
          <Form
            layout="horizontal"
            onFinish={handlePasswordSubmit}
            footer={
              <Button block type="submit" color="primary">
                确认
              </Button>
            }
          >
            <Form.Item name="oldPassword" label="当前密码" rules={[{ required: true }]}>
              <Input placeholder="请输入当前密码" type="password" />
            </Form.Item>
            <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}>
              <Input placeholder="请输入新密码" type="password" />
            </Form.Item>
            <Form.Item name="confirmPassword" label="确认新密码" rules={[{ required: true }]}>
              <Input placeholder="请再次输入新密码" type="password" />
            </Form.Item>
          </Form>
        }
        closeOnAction
        onClose={() => setPasswordVisible(false)}
        actions={[
          {
            key: 'cancel',
            text: '取消',
          },
        ]}
      />
      
      {/* 修改手机号弹窗 */}
      <Dialog
        visible={phoneChangeVisible}
        title="修改手机号"
        content={
          <Form
            layout="horizontal"
            onFinish={handlePhoneSubmit}
            footer={
              <Button block type="submit" color="primary">
                确认
              </Button>
            }
          >
            <Form.Item name="newPhone" label="新手机号" rules={[{ required: true }]}>
              <Input placeholder="请输入新手机号" />
            </Form.Item>
            <Form.Item name="verificationCode" label="验证码" rules={[{ required: true }]}>
              <Input 
                placeholder="请输入验证码" 
                extra={
                  <Button size="small" color="primary">获取验证码</Button>
                }
              />
            </Form.Item>
          </Form>
        }
        closeOnAction
        onClose={() => setPhoneChangeVisible(false)}
        actions={[
          {
            key: 'cancel',
            text: '取消',
          },
        ]}
      />
      
      {/* 修改邮箱弹窗 */}
      <Dialog
        visible={emailChangeVisible}
        title="修改邮箱"
        content={
          <Form
            layout="horizontal"
            onFinish={handleEmailSubmit}
            footer={
              <Button block type="submit" color="primary">
                确认
              </Button>
            }
          >
            <Form.Item name="newEmail" label="新邮箱" rules={[{ required: true }]}>
              <Input placeholder="请输入新邮箱" />
            </Form.Item>
            <Form.Item name="verificationCode" label="验证码" rules={[{ required: true }]}>
              <Input 
                placeholder="请输入验证码" 
                extra={
                  <Button size="small" color="primary">获取验证码</Button>
                }
              />
            </Form.Item>
          </Form>
        }
        closeOnAction
        onClose={() => setEmailChangeVisible(false)}
        actions={[
          {
            key: 'cancel',
            text: '取消',
          },
        ]}
      />
    </div>
  );
};

export default InfoManagement;