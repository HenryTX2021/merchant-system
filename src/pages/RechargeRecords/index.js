import React, { useState } from 'react';
import { List, Dialog, Image, ImageViewer, Button } from 'antd-mobile';
import { RightOutline, DownOutline } from 'antd-mobile-icons';
import * as XLSX from 'xlsx';
import './style.css';
import '../../styles/common.css';

const RechargeRecords = () => {
  const [rechargeDetailVisible, setRechargeDetailVisible] = useState(false);
  const [selectedRecharge, setSelectedRecharge] = useState(null);
  
  // 导出到Excel功能
  const exportToExcel = () => {
    // 准备导出数据
    const exportData = rechargeRecords.map(record => ({
      '充值金额': record.amount.toFixed(2) + ' 元',
      '充值方式': record.method,
      '支付凭证': record.voucher, // 图片链接
      '备注': record.remarks || '无',
      '申请时间': record.time,
      '审核结果': record.reviewResult
    }));
    
    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '充值记录');
    
    // 设置列宽
    const columnWidths = [
      { wch: 15 }, // 充值金额
      { wch: 15 }, // 充值方式
      { wch: 50 }, // 支付凭证
      { wch: 20 }, // 备注
      { wch: 20 }, // 申请时间
      { wch: 15 }, // 审核结果
    ];
    worksheet['!cols'] = columnWidths;
    
    // 导出文件
    XLSX.writeFile(workbook, `充值记录_${new Date().toLocaleDateString()}.xlsx`);
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
    {
      id: 'R004',
      amount: 500.00,
      method: '支付宝',
      status: 'completed',
      time: '2025-04-20 11:30',
      voucher: 'https://example.com/voucher4.jpg',
      remarks: '小额充值',
      reviewResult: '已通过',
    },
    {
      id: 'R005',
      amount: 1500.00,
      method: '银行转账',
      status: 'failed',
      time: '2025-04-15 16:20',
      voucher: 'https://example.com/voucher5.jpg',
      remarks: '紧急充值',
      reviewResult: '审核不通过',
    },
    {
      id: 'R006',
      amount: 2500.00,
      method: '支付宝',
      status: 'completed',
      time: '2025-04-10 09:00',
      voucher: 'https://example.com/voucher6.jpg',
      remarks: '常规充值',
      reviewResult: '已通过',
    },
    {
      id: 'R007',
      amount: 800.00,
      method: '银行转账',
      status: 'completed',
      time: '2025-04-05 14:45',
      voucher: 'https://example.com/voucher7.jpg',
      remarks: '小额充值',
      reviewResult: '已通过',
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

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="records-container">
      <div className="records-header page-header">
        <div className="back-icon" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4166 14.6673L17.4166 22.0007L27.4166 29.334" stroke="currentColor" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>充值记录</h2>
        <div className="export-button" onClick={exportToExcel}>
          <DownOutline />
          <span>导出</span>
        </div>
      </div>

      <List className="records-list">
        {rechargeRecords.map((record) => (
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
    </div>
  );
};

export default RechargeRecords;