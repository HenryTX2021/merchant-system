import React, { useState, useEffect } from 'react';
import { List, Dialog, Button, Space, Toast } from 'antd-mobile';
import { RightOutline, DownOutline } from 'antd-mobile-icons';
import * as XLSX from 'xlsx';
import './style.css';
import '../../styles/common.css';

const FrozenDetails = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [frozenRecords, setFrozenRecords] = useState([]);

  // 模拟冻结金额数据
  useEffect(() => {
    // 这里应该是从API获取数据，现在使用模拟数据
    const mockFrozenRecords = [
      {
        id: 'F001',
        amount: 800.00,
        orderId: 'DZ10001',
        feeName: '订单处理费',
        frozenTime: '2025-05-12 15:20',
        transactionId: 'TRX20250512001',
        arlTrackingNumber: 'ARL8765432',
        darazOrderId: 'DZ10001',
        shippingFrom: '广州仓'
      },
      {
        id: 'F002',
        amount: 650.00,
        orderId: 'EX20001',
        feeName: '国际物流费',
        frozenTime: '2025-05-11 11:30',
        transactionId: 'TRX20250511002',
        arlTrackingNumber: 'ARL8765433',
        darazOrderId: 'EX20001',
        shippingFrom: '深圳仓'
      },
      {
        id: 'F003',
        amount: 550.00,
        orderId: 'DZ10002',
        feeName: '订单处理费',
        frozenTime: '2025-05-08 16:45',
        transactionId: 'TRX20250508003',
        arlTrackingNumber: 'ARL8765434',
        darazOrderId: 'DZ10002',
        shippingFrom: '广州仓'
      },
    ];
    setFrozenRecords(mockFrozenRecords);
  }, []);

  // 导出到Excel功能
  const exportToExcel = () => {
    // 准备导出数据
    const exportData = frozenRecords.map(record => ({
      '冻结金额': record.amount.toFixed(2),
      '订单号': record.orderId,
      '费用名称': record.feeName,
      '冻结时间': record.frozenTime,
      '流水号': record.transactionId,
      'ARL运单号': record.arlTrackingNumber,
      '关联单号': record.darazOrderId,
      '发货地': record.shippingFrom
    }));

    // 创建工作簿和工作表
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '冻结金额明细');

    // 导出Excel文件
    XLSX.writeFile(wb, '冻结金额明细.xlsx');
    Toast.show({
      icon: 'success',
      content: '导出成功',
    });
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="frozen-container">
      <div className="frozen-header page-header">
        <div className="back-icon" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4166 14.6673L17.4166 22.0007L27.4166 29.334" stroke="currentColor" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>冻结金额明细</h2>
        <Button
          size="small"
          onClick={exportToExcel}
          icon={<DownOutline />}
        >
          导出
        </Button>
      </div>

      <div className="frozen-description">
        <p>冻结金额是指中国仓完成称重，暂未出库订单的费用。如订单在中国仓出库前取消，冻结金额将归还至可用余额。</p>
      </div>

      <List className="frozen-list">
        {frozenRecords.length > 0 ? (
          frozenRecords.map((record) => (
            <List.Item
              key={record.id}
              extra={<RightOutline />}
              onClick={() => {
                setSelectedRecord(record);
                setDetailVisible(true);
              }}
              arrow={false}
            >
              <div className="frozen-record">
                <div className="frozen-record-header">
                  <div className="frozen-record-amount">{record.amount.toFixed(2)}</div>
                </div>
                <div className="frozen-record-info">
                  <div>订单号: {record.orderId}</div>
                  <div>费用名称: {record.feeName}</div>
                  <div>冻结时间: {record.frozenTime}</div>
                </div>
              </div>
            </List.Item>
          ))
        ) : (
          <div className="empty-records">
            <p>暂无冻结金额记录</p>
          </div>
        )}
      </List>

      {/* 冻结金额详情对话框 */}
      <Dialog
        visible={detailVisible}
        title="冻结金额详情"
        content={
          selectedRecord && (
            <div className="frozen-detail">
              <div className="detail-item">
                <span className="detail-label">流水号:</span>
                <span className="detail-value">{selectedRecord.transactionId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">ARL运单号:</span>
                <span className="detail-value">{selectedRecord.arlTrackingNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">关联单号:</span>
                <span className="detail-value">{selectedRecord.darazOrderId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">费用名称:</span>
                <span className="detail-value">{selectedRecord.feeName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">费用金额:</span>
                <span className="detail-value frozen">{selectedRecord.amount.toFixed(2)} 元</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">冻结时间:</span>
                <span className="detail-value">{selectedRecord.frozenTime}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">发货地:</span>
                <span className="detail-value">{selectedRecord.shippingFrom}</span>
              </div>
            </div>
          )
        }
        closeOnAction
        onClose={() => setDetailVisible(false)}
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

export default FrozenDetails;