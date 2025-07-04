import React, { useState, useEffect } from 'react';
import { List, Dialog, Form, Input, DatePicker, Button, Selector, Space, Collapse, Toast } from 'antd-mobile';
import { RightOutline, SearchOutline, DownOutline, CloseCircleOutline } from 'antd-mobile-icons';
import * as XLSX from 'xlsx';
import './style.css';
import '../../styles/common.css';

const ConsumptionRecords = () => {
  const [consumptionDetailVisible, setConsumptionDetailVisible] = useState(false);
  const [selectedConsumption, setSelectedConsumption] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  
  // 导出到Excel功能
  const exportToExcel = () => {
    // 准备导出数据
    const exportData = filteredRecords.map(record => ({
      '扣费流水号': record.transactionId,
      'ARL运单号': record.arlTrackingNumber,
      '关联单号': record.darazOrderId,
      '费用名称': record.feeName,
      '费用金额': record.amount.toFixed(2) + ' 元',
      '扣费时间': record.time,
      '发货地': record.shippingFrom
    }));
    
    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '消费明细');
    
    // 设置列宽
    const columnWidths = [
      { wch: 20 }, // 扣费流水号
      { wch: 15 }, // ARL运单号
      { wch: 25 }, // Daraz订单号/电商订单号
      { wch: 15 }, // 费用名称
      { wch: 15 }, // 费用金额
      { wch: 20 }, // 扣费时间
      { wch: 15 }, // 发货地
    ];
    worksheet['!cols'] = columnWidths;
    
    // 导出文件
    XLSX.writeFile(workbook, `消费明细_${new Date().toLocaleDateString()}.xlsx`);
    
    Toast.show({
      icon: 'success',
      content: '导出成功',
    });
  };
  
  const [filterParams, setFilterParams] = useState({
    transactionId: '',
    arlTrackingNumbers: '',
    orderIds: '',
    feeName: '',
    startTime: '',
    endTime: '',
    shippingFrom: '',
  });
  
  // 模拟费用名称选项
  const feeNameOptions = [
    { label: '头程运输费', value: '头程运输费' },
    { label: '换单费', value: '换单费' },
    { label: '仓储费', value: '仓储费' },
    { label: '包材费', value: '包材费' },
    { label: '销毁费', value: '销毁费' },
  ];
  
  // 模拟发货地选项
  const shippingFromOptions = [
    { label: '中国', value: '中国' },
    { label: '孟加拉', value: '孟加拉' },
    { label: '巴基斯坦', value: '巴基斯坦' },
    { label: '斯里兰卡', value: '斯里兰卡' },
    { label: '尼泊尔', value: '尼泊尔' },
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
      feeName: '头程运输费',
      shippingFrom: '中国',
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
      feeName: '头程运输费',
      shippingFrom: '孟加拉',
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
      shippingFrom: '中国',
    },
    {
      id: 'C004',
      amount: 150.00,
      type: '物流费用',
      orderId: 'EX20002',
      time: '2025-05-07 09:15',
      transactionId: 'TRX20250507004',
      arlTrackingNumber: 'ARL8765435',
      darazOrderId: 'EX20002',
      feeName: '包材费',
      shippingFrom: '巴基斯坦',
    },
    {
      id: 'C005',
      amount: 280.00,
      type: '订单支付',
      orderId: 'DZ10003',
      time: '2025-05-05 14:30',
      transactionId: 'TRX20250505005',
      arlTrackingNumber: 'ARL8765436',
      darazOrderId: 'DZ10003',
      feeName: '销毁费',
      shippingFrom: '中国',
    },
    {
      id: 'C006',
      amount: 200.00,
      type: '物流费用',
      orderId: 'EX20003',
      time: '2025-05-03 10:45',
      transactionId: 'TRX20250503006',
      arlTrackingNumber: 'ARL8765437',
      darazOrderId: 'EX20003',
      feeName: '换单费',
      shippingFrom: '尼泊尔',
    },
    {
      id: 'C007',
      amount: 350.00,
      type: '订单支付',
      orderId: 'DZ10004',
      time: '2025-05-01 16:20',
      transactionId: 'TRX20250501007',
      arlTrackingNumber: 'ARL8765438',
      darazOrderId: 'DZ10004',
      feeName: '仓储费',
      shippingFrom: '斯里兰卡',
    },
  ];

  // 初始化筛选结果
  useEffect(() => {
    setFilteredRecords(consumptionRecords);
  }, []);

  const goBack = () => {
    window.history.back();
  };
  
  // 处理筛选条件变化
  const handleFilterChange = (name, value) => {
    setFilterParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 重置筛选条件
  const resetFilters = () => {
    setFilterParams({
      transactionId: '',
      arlTrackingNumbers: '',
      orderIds: '',
      feeName: '',
      startTime: '',
      endTime: '',
      shippingFrom: '',
    });
  };
  
  // 应用筛选条件
  const applyFilters = () => {
    let results = [...consumptionRecords];
    
    // 按扣费流水号筛选
    if (filterParams.transactionId) {
      results = results.filter(record => 
        record.transactionId.toLowerCase().includes(filterParams.transactionId.toLowerCase())
      );
    }
    
    // 按ARL运单号筛选（支持多单查询，以逗号分隔）
    if (filterParams.arlTrackingNumbers) {
      const trackingNumbers = filterParams.arlTrackingNumbers.split(',').map(num => num.trim().toLowerCase());
      results = results.filter(record => 
        trackingNumbers.some(num => record.arlTrackingNumber.toLowerCase().includes(num))
      );
    }
    
    // 按Daraz订单号/电商订单号筛选（支持多单查询，以逗号分隔）
    if (filterParams.orderIds) {
      const orderIds = filterParams.orderIds.split(',').map(id => id.trim().toLowerCase());
      results = results.filter(record => 
        orderIds.some(id => record.darazOrderId.toLowerCase().includes(id))
      );
    }
    
    // 按费用名称筛选
    if (filterParams.feeName) {
      results = results.filter(record => record.feeName === filterParams.feeName);
    }
    
    // 按扣费时间区间筛选
    if (filterParams.startTime && filterParams.endTime) {
      results = results.filter(record => {
        const recordTime = new Date(record.time);
        const startTime = new Date(filterParams.startTime);
        const endTime = new Date(filterParams.endTime);
        return recordTime >= startTime && recordTime <= endTime;
      });
    }
    
    // 按发货地筛选
    if (filterParams.shippingFrom) {
      results = results.filter(record => record.shippingFrom === filterParams.shippingFrom);
    }
    
    setFilteredRecords(results);
    setFilterVisible(false);
    Toast.show({
      icon: 'success',
      content: `找到 ${results.length} 条记录`,
    });
  };

  return (
    <div className="records-container">
      <div className="records-header page-header">
        <div className="back-icon" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.4166 14.6673L17.4166 22.0007L27.4166 29.334" stroke="currentColor" strokeWidth="3.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>消费明细</h2>
        <div className="export-button" onClick={exportToExcel}>
          <DownOutline />
          <span>导出</span>
        </div>
      </div>
      
      {/* 筛选条件表单 */}
      <Collapse activeKey={filterVisible ? ['1'] : []}>
        <Collapse.Panel 
          key="1" 
          title={
            <div className="filter-header">
              <span>多条件查询</span>
              {filterVisible ? <DownOutline /> : <SearchOutline />}
             </div>
          } 
          className="filter-panel"
          onClick={() => setFilterVisible(!filterVisible)}
        >
          <div className="filter-form">
            <Form layout="horizontal">
              <Form.Item label="扣费流水号">
                <Input 
                  placeholder="请输入扣费流水号" 
                  value={filterParams.transactionId}
                  onChange={val => handleFilterChange('transactionId', val)}
                />
              </Form.Item>
              
              <Form.Item label="ARL运单号">
                <Input 
                  placeholder="请输入运单号，多个用逗号分隔" 
                  value={filterParams.arlTrackingNumbers}
                  onChange={val => handleFilterChange('arlTrackingNumbers', val)}
                />
              </Form.Item>
              
              <Form.Item label="订单号">
                <Input 
                  placeholder="请输入订单号，多个用逗号分隔" 
                  value={filterParams.orderIds}
                  onChange={val => handleFilterChange('orderIds', val)}
                />
              </Form.Item>
              
              <Form.Item label="费用名称">
                <Selector
                  options={feeNameOptions}
                  value={filterParams.feeName ? [filterParams.feeName] : []}
                  onChange={val => handleFilterChange('feeName', val[0] || '')}
                />
              </Form.Item>
              
              <Form.Item label="扣费时间">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <DatePicker
                    title="开始时间"
                    value={filterParams.startTime ? new Date(filterParams.startTime) : null}
                    onChange={val => handleFilterChange('startTime', val ? val.toISOString() : '')}
                  >
                    {value => value ? value.toLocaleDateString() : '开始时间'}
                  </DatePicker>
                  <DatePicker
                    title="结束时间"
                    value={filterParams.endTime ? new Date(filterParams.endTime) : null}
                    onChange={val => handleFilterChange('endTime', val ? val.toISOString() : '')}
                  >
                    {value => value ? value.toLocaleDateString() : '结束时间'}
                  </DatePicker>
                </Space>
              </Form.Item>
              
              <Form.Item label="发货地">
                <Selector
                  options={shippingFromOptions}
                  value={filterParams.shippingFrom ? [filterParams.shippingFrom] : []}
                  onChange={val => handleFilterChange('shippingFrom', val[0] || '')}
                />
              </Form.Item>
              
              <div className="filter-buttons">
                <Button onClick={resetFilters}>重置</Button>
                <Button color="primary" onClick={applyFilters}>查询</Button>
              </div>
            </Form>
          </div>
        </Collapse.Panel>
      </Collapse>

      <div className="filter-summary">
        {Object.entries(filterParams).some(([_, value]) => value) && (
          <div className="active-filters">
            <span>筛选条件：</span>
            {filterParams.transactionId && (
              <span className="filter-tag">流水号: {filterParams.transactionId} <CloseCircleOutline onClick={() => handleFilterChange('transactionId', '')} /></span>
            )}
            {filterParams.arlTrackingNumbers && (
              <span className="filter-tag">运单号: {filterParams.arlTrackingNumbers} <CloseCircleOutline onClick={() => handleFilterChange('arlTrackingNumbers', '')} /></span>
            )}
            {filterParams.orderIds && (
              <span className="filter-tag">订单号: {filterParams.orderIds} <CloseCircleOutline onClick={() => handleFilterChange('orderIds', '')} /></span>
            )}
            {filterParams.feeName && (
              <span className="filter-tag">费用名称: {filterParams.feeName} <CloseCircleOutline onClick={() => handleFilterChange('feeName', '')} /></span>
            )}
            {(filterParams.startTime && filterParams.endTime) && (
              <span className="filter-tag">时间区间: {new Date(filterParams.startTime).toLocaleDateString()} - {new Date(filterParams.endTime).toLocaleDateString()} <CloseCircleOutline onClick={() => { handleFilterChange('startTime', ''); handleFilterChange('endTime', ''); }} /></span>
            )}
            {filterParams.shippingFrom && (
              <span className="filter-tag">发货地: {filterParams.shippingFrom} <CloseCircleOutline onClick={() => handleFilterChange('shippingFrom', '')} /></span>
            )}
          </div>
        )}
      </div>

      <List className="records-list">
        {filteredRecords.length > 0 ? filteredRecords.map((record) => (
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
                <div>订单号: {record.darazOrderId}</div>
                <div>费用名称: {record.feeName}</div>
                <div>扣费时间: {record.time}</div>
              </div>
            </div>
          </List.Item>
        )) : (
          <div className="empty-records">
            <p>没有找到符合条件的记录</p>
          </div>
        )}
      </List>

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
                <span className="detail-label">关联单号:</span>
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
              <div className="detail-item">
                <span className="detail-label">发货地:</span>
                <span className="detail-value">{selectedConsumption.shippingFrom}</span>
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

export default ConsumptionRecords;