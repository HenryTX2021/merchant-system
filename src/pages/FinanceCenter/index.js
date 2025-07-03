import React, { useState, useRef } from 'react';
import { Tabs, Card, List, Button, Dialog, Form, Input, TextArea, ImageUploader, Toast, Selector, Image, ImageViewer } from 'antd-mobile';
import { RightOutline, PictureOutline } from 'antd-mobile-icons';
import './style.css';
import '../../styles/common.css';

const FinanceCenter = () => {
  const [activeTab, setActiveTab] = useState('balance');
  const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
  const [rechargeDetailVisible, setRechargeDetailVisible] = useState(false);
  const [consumptionDetailVisible, setConsumptionDetailVisible] = useState(false);
  const [selectedRecharge, setSelectedRecharge] = useState(null);
  const [selectedConsumption, setSelectedConsumption] = useState(null);
  const [fileList, setFileList] = useState([]);
  const formRef = useRef(null);

  // 模拟账户数据
  const accountBalance = {
    balance: 5280.00,
    frozen: 0.00,
    available: 5280.00,
  };

  // 模拟充值记录
  const rechargeRecords = [
    {
      id: 'R001',
      amount: 2000.00,
      method: '支付宝',
      status: 'completed',
      time: '2025-05-10 14:30',
      voucher: 'https://example.com/voucher1.jpg',
      remarks: '月度充值',
      reviewResult: '已通过',
    },
    {
      id: 'R002',
      amount: 3000.00,
      method: '银行转账',
      status: 'completed',
      time: '2025-04-25 10:15',
      voucher: 'https://example.com/voucher2.jpg',
      remarks: '季度充值',
      reviewResult: '已通过',
    },
    {
      id: 'R003',
      amount: 1000.00,
      method: '支付宝',
      status: 'pending',
      time: '2025-05-15 09:45',
      voucher: 'https://example.com/voucher3.jpg',
      remarks: '临时充值',
      reviewResult: '审核中',
    },
  ];

  // 模拟消费记录
  const consumptionRecords = [
    {
      id: 'C001',
      amount: 320.00,
      type: '订单支付',
      orderId: 'DZ10001',
      time: '2025-05-12 15:20',
      transactionId: 'TRX20250512001',
      arlTrackingNumber: 'ARL8765432',
      darazOrderId: 'DZ10001',
      feeName: '订单处理费',
    },
    {
      id: 'C002',
      amount: 180.00,
      type: '物流费用',
      orderId: 'EX20001',
      time: '2025-05-11 11:30',
      transactionId: 'TRX20250511002',
      arlTrackingNumber: 'ARL8765433',
      darazOrderId: 'EX20001',
      feeName: '国际物流费',
    },
    {
      id: 'C003',
      amount: 220.00,
      type: '订单支付',
      orderId: 'DZ10002',
      time: '2025-05-08 16:45',
      transactionId: 'TRX20250508003',
      arlTrackingNumber: 'ARL8765434',
      darazOrderId: 'DZ10002',
      feeName: '订单处理费',
    },
  ];

  const getStatusTag = (status) => {
    let color = '';
    let text = '';

    switch (status) {
      case 'completed':
        color = '#00b578';
        text = '已完成';
        break;
      case 'pending':
        color = '#ff8f1f';
        text = '审核中';
        break;
      case 'failed':
        color = '#ff3141';
        text = '审核不通过';
        break;
      default:
        color = '#999';
        text = '未知';
    }

    return <span className={`status-tag status-${status}`}>{text}</span>;
  };

  const handleRecharge = (values) => {
    console.log('充值信息:', { ...values, vouchers: fileList });
    setRechargeModalVisible(false);
    Toast.show({
      icon: 'success',
      content: '充值申请已提交，请等待审核',
    });
    // 这里应该有实际的充值逻辑
  };

  // 模拟图片上传
  const mockUpload = async (file) => {
    return {
      url: URL.createObjectURL(file),
    };
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="finance-container">
      <div className="finance-header page-header">
        <div className="back-icon" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4166 14.6673L17.4166 22.0007L27.4166 29.334" stroke="currentColor" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>财务中心</h2>
        <div className="placeholder"></div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.Tab title="我的余额" key="balance">
          <Card className="balance-card">
            <div className="balance-info">
              <div className="balance-title">账户余额 (元)</div>
              <div className="balance-amount">{accountBalance.balance.toFixed(2)}</div>
              <div className="balance-details">
                <div className="balance-detail-item">
                  <span>可用余额:</span>
                  <span>{accountBalance.available.toFixed(2)}</span>
                </div>
                <div className="balance-detail-item">
                  <span>冻结金额:</span>
                  <span 
                    className="clickable-amount"
                    onClick={() => window.location.href = '/merchant/frozen-details'}
                  >
                    {accountBalance.frozen.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                color="primary"
                block
                onClick={() => setRechargeModalVisible(true)}
              >
                充值
              </Button>
            </div>
          </Card>

          <div className="record-section">
            <div className="record-header">
              <div className="record-title">充值记录</div>
              <div className="view-all" onClick={() => window.location.href = '/merchant/recharge-records'}>全部</div>
            </div>
            <List className="finance-list">
              {rechargeRecords.slice(0, 5).map((record) => (
                <List.Item
                  key={record.id}
                  extra={<RightOutline />}
                  onClick={() => {
                    setSelectedRecharge(record);
                    setRechargeDetailVisible(true);
                  }}
                  arrow={false}
                >
                  <div className="finance-record">
                    <div className="finance-record-header">
                      <div className="finance-record-amount">+{record.amount.toFixed(2)}</div>
                      {getStatusTag(record.status)}
                    </div>
                    <div className="finance-record-info">
                      <div>充值方式: {record.method}</div>
                      <div>充值时间: {record.time}</div>
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          </div>

          <div className="record-section">
            <div className="record-header">
              <div className="record-title">消费明细</div>
              <div className="view-all" onClick={() => window.location.href = '/merchant/consumption-records'}>全部</div>
            </div>
            <List className="finance-list">
              {consumptionRecords.slice(0, 5).map((record) => (
                <List.Item
                  key={record.id}
                  extra={<RightOutline />}
                  onClick={() => {
                    setSelectedConsumption(record);
                    setConsumptionDetailVisible(true);
                  }}
                  arrow={false}
                >
                  <div className="finance-record">
                    <div className="finance-record-header">
                      <div className="finance-record-amount consumption">-{record.amount.toFixed(2)}</div>
                    </div>
                    <div className="finance-record-info">
                      <div>类型: {record.type}</div>
                      <div>订单号: {record.orderId}</div>
                      <div>时间: {record.time}</div>
                    </div>
                  </div>
                </List.Item>
              ))}
            </List>
          </div>
        </Tabs.Tab>

        <Tabs.Tab title="充值" key="recharge">
          <Card className="recharge-card">
            <div className="recharge-info">
              <div className="recharge-title">账户充值</div>
              <div className="recharge-subtitle">请选择充值方式并填写相关信息</div>

              <Form
                layout="horizontal"
                onFinish={handleRecharge}
                footer={
                  <Button block type="submit" color="primary" size="large">
                    提交充值申请
                  </Button>
                }
              >
                <Form.Item
                  name="amount"
                  label="充值金额"
                  rules={[{ required: true, message: '请输入充值金额' }]}
                >
                  <Input type="number" placeholder="请输入充值金额" />
                </Form.Item>

                <Form.Item
                  name="method"
                  label="充值方式"
                  rules={[{ required: true, message: '请选择充值方式' }]}
                >
                  <Selector
                    options={[
                      { label: '支付宝', value: 'alipay' },
                      { label: '银行转账', value: 'bank' },
                    ]}
                  />
                </Form.Item>



                <Form.Item
                  name="voucher"
                  label="支付凭证"
                  rules={[{ required: true, message: '请上传支付凭证' }]}
                >
                  <ImageUploader
                    value={fileList}
                    onChange={setFileList}
                    upload={mockUpload}
                    multiple={false}
                    maxCount={1}
                    showUpload={fileList.length < 1}
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
                      <span>上传凭证</span>
                    </div>
                  </ImageUploader>
                </Form.Item>

                <Form.Item
                  name="remarks"
                  label="备注"
                >
                  <TextArea placeholder="请输入备注信息" maxLength={100} rows={2} />
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Tabs.Tab>
      </Tabs>

      <Dialog
        visible={rechargeModalVisible}
        title="账户充值"
        content={
          <Form layout="horizontal" onFinish={handleRecharge} ref={formRef}>
            <Form.Item
              name="amount"
              label="充值金额"
              rules={[{ required: true, message: '请输入充值金额' }]}
            >
              <Input type="number" placeholder="请输入充值金额" />
            </Form.Item>

            <Form.Item
              name="method"
              label="充值方式"
              rules={[{ required: true, message: '请选择充值方式' }]}
            >
              <Selector
                options={[
                  { label: '支付宝', value: 'alipay' },
                  { label: '银行转账', value: 'bank' },
                ]}
              />
            </Form.Item>



            <Form.Item
              name="voucher"
              label="支付凭证"
              rules={[{ required: true, message: '请上传支付凭证' }]}
            >
              <ImageUploader
                value={fileList}
                onChange={setFileList}
                upload={mockUpload}
                multiple={false}
                maxCount={1}
                showUpload={fileList.length < 1}
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
                  <span>上传凭证</span>
                </div>
              </ImageUploader>
            </Form.Item>

            <Form.Item
              name="remarks"
              label="备注"
            >
              <TextArea placeholder="请输入备注信息" maxLength={100} rows={2} />
            </Form.Item>
          </Form>
        }
        closeOnAction
        onClose={() => setRechargeModalVisible(false)}
        actions={[
          {
            key: 'cancel',
            text: '取消',
          },
          {
            key: 'confirm',
            text: '提交',
            bold: true,
            danger: false,
            onClick: () => {
              // 表单提交逻辑在Form的onFinish中处理
              if (formRef.current) {
                formRef.current.submit();
              }
            },
          },
        ]}
      />

      {/* 充值记录详情对话框 */}
      <Dialog
        visible={rechargeDetailVisible}
        title="充值记录详情"
        content={
          selectedRecharge && (
            <div className="recharge-detail">
              <div className="detail-item">
                <span className="detail-label">充值金额:</span>
                <span className="detail-value">{selectedRecharge.amount.toFixed(2)} 元</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">充值方式:</span>
                <span className="detail-value">{selectedRecharge.method}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">支付凭证:</span>
                <div className="detail-value">
                  <img 
                    src={selectedRecharge.voucher} 
                    alt="支付凭证" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                    onClick={() => {
                      ImageViewer.Multi.show({ images: [selectedRecharge.voucher] });
                    }}
                  />
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">备注:</span>
                <span className="detail-value">{selectedRecharge.remarks || '无'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">申请时间:</span>
                <span className="detail-value">{selectedRecharge.time}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">审核结果:</span>
                <span className="detail-value">{selectedRecharge.reviewResult}</span>
              </div>
            </div>
          )
        }
        closeOnAction
        onClose={() => setRechargeDetailVisible(false)}
        actions={[
          {
            key: 'close',
            text: '关闭',
          },
        ]}
      />

      {/* 充值记录详情对话框 */}
      <Dialog
        visible={rechargeDetailVisible}
        title="充值记录详情"
        content={
          selectedRecharge && (
            <div className="recharge-detail">
              <div className="detail-item">
                <span className="detail-label">充值金额:</span>
                <span className="detail-value">{selectedRecharge.amount.toFixed(2)} 元</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">充值方式:</span>
                <span className="detail-value">{selectedRecharge.method}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">支付凭证:</span>
                <div className="detail-value">
                  <img 
                    src={selectedRecharge.voucher} 
                    alt="支付凭证" 
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                    onClick={() => {
                      ImageViewer.Multi.show({ images: [selectedRecharge.voucher] });
                    }}
                  />
                </div>
              </div>
              <div className="detail-item">
                <span className="detail-label">备注:</span>
                <span className="detail-value">{selectedRecharge.remarks || '无'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">申请时间:</span>
                <span className="detail-value">{selectedRecharge.time}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">审核结果:</span>
                <span className="detail-value">{selectedRecharge.reviewResult}</span>
              </div>
            </div>
          )
        }
        closeOnAction
        onClose={() => setRechargeDetailVisible(false)}
        actions={[
          {
            key: 'close',
            text: '关闭',
          },
        ]}
      />

      {/* 消费明细详情对话框 */}
      <Dialog
        visible={consumptionDetailVisible}
        title="扣费明细"
        content={
          selectedConsumption && (
            <div className="recharge-detail">
              <div className="detail-item">
                <span className="detail-label">扣费流水号:</span>
                <span className="detail-value">{selectedConsumption.transactionId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ARL运单号:</span>
                <span className="detail-value">{selectedConsumption.arlTrackingNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Daraz订单号/电商订单号:</span>
                <span className="detail-value">{selectedConsumption.darazOrderId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">费用名称:</span>
                <span className="detail-value">{selectedConsumption.feeName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">费用金额:</span>
                <span className="detail-value consumption">{selectedConsumption.amount.toFixed(2)} 元</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">扣费时间:</span>
                <span className="detail-value">{selectedConsumption.time}</span>
              </div>
            </div>
          )
        }
        closeOnAction
        onClose={() => setConsumptionDetailVisible(false)}
        actions={[
          {
            key: 'close',
            text: '关闭',
          },
        ]}
      />
    </div>
  );
};

export default FinanceCenter;