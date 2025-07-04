import React, { useState, useEffect } from 'react';
import { List, Button, Tag, Space } from 'antd-mobile';
import { LeftOutline, ClockCircleOutline } from 'antd-mobile-icons';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import './ItemChangeHistory.css';

const ItemChangeHistory = () => {
  const history = useHistory();
  const { itemId } = useParams();
  const location = useLocation();
  const [itemInfo, setItemInfo] = useState(null);
  const [changeHistory, setChangeHistory] = useState([]);
  
  // 解析URL查询参数
  const searchParams = new URLSearchParams(location.search);
  const shopSku = searchParams.get('shopSku');
  const sellerSku = searchParams.get('sellerSku');
  const warehouse = searchParams.get('warehouse');

  // 模拟Item基本信息
  const mockItemInfo = {
    itemId: itemId,
    shopSku: shopSku || 'UNKNOWN-SHOP-SKU',
    sellerSku: sellerSku || 'UNKNOWN-SELLER-SKU',
    productName: '益加益合 佳能手动飞机杯 for Men To Musturbate',
    productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    warehouseName: warehouse || '未知仓库',
    currentStatus: 'available',
    inboundTime: '2024-01-15 14:30:25',
    daysInWarehouse: 15
  };

  // 模拟Item变动历史数据
  const mockChangeHistory = [
    {
      id: 1,
      changeTime: '2024-01-30 16:45:32',
      changeType: 'outbound',
      changeQuantity: -1,
      stockBefore: 1,
      stockAfter: 0,
      relatedOrderNo: 'SO2024013000123',
      changeReason: '销售出库',
      operator: '系统自动',
      remark: '订单出库操作'
    },
    {
      id: 2,
      changeTime: '2024-01-25 10:20:15',
      changeType: 'freeze',
      changeQuantity: 0,
      stockBefore: 1,
      stockAfter: 1,
      relatedOrderNo: 'FRZ2024012500045',
      changeReason: '质量问题冻结',
      operator: '张三',
      remark: '客户投诉质量问题，暂时冻结'
    },
    {
      id: 3,
      changeTime: '2024-01-20 14:15:28',
      changeType: 'unfreeze',
      changeQuantity: 0,
      stockBefore: 1,
      stockAfter: 1,
      relatedOrderNo: 'UFZ2024012000032',
      changeReason: '解除冻结',
      operator: '李四',
      remark: '质量检查通过，解除冻结状态'
    },
    {
      id: 4,
      changeTime: '2024-01-18 09:30:45',
      changeType: 'freeze',
      changeQuantity: 0,
      stockBefore: 1,
      stockAfter: 1,
      relatedOrderNo: 'FRZ2024011800021',
      changeReason: '例行质检',
      operator: '王五',
      remark: '定期质量检查'
    },
    {
      id: 5,
      changeTime: '2024-01-15 14:30:25',
      changeType: 'inbound',
      changeQuantity: 1,
      stockBefore: 0,
      stockAfter: 1,
      relatedOrderNo: 'PO2024011500089',
      changeReason: '采购入库',
      operator: '系统自动',
      remark: '供应商发货入库'
    }
  ];

  useEffect(() => {
    // 模拟数据加载
    setItemInfo(mockItemInfo);
    setChangeHistory(mockChangeHistory);
  }, [itemId, shopSku, sellerSku, warehouse]);

  // 获取变动类型标签
  const getChangeTypeTag = (type) => {
    const typeMap = {
      'inbound': { text: '入库', color: '#52c41a' },
      'outbound': { text: '出库', color: '#ff4d4f' },
      'freeze': { text: '冻结', color: '#fa8c16' },
      'unfreeze': { text: '解冻', color: '#1890ff' },
      'transfer': { text: '调拨', color: '#722ed1' },
      'adjust': { text: '调整', color: '#13c2c2' },
      'damage': { text: '损坏', color: '#f5222d' }
    };
    const config = typeMap[type] || { text: type, color: '#666' };
    return (
      <Tag color={config.color} fill="outline" className="change-type-tag">
        {config.text}
      </Tag>
    );
  };

  // 格式化变动数量
  const formatChangeQuantity = (quantity) => {
    if (quantity > 0) {
      return <span className="quantity-increase">+{quantity}</span>;
    } else if (quantity < 0) {
      return <span className="quantity-decrease">{quantity}</span>;
    } else {
      return <span className="quantity-neutral">0</span>;
    }
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    const statusMap = {
      'available': { text: '可用', color: '#52c41a' },
      'frozen': { text: '冻结', color: '#fa8c16' },
      'defective': { text: '不良品', color: '#ff4d4f' }
    };
    const config = statusMap[status] || { text: status, color: '#666' };
    return (
      <Tag color={config.color} fill="outline">
        {config.text}
      </Tag>
    );
  };

  // 处理关联单号点击
  const handleOrderClick = (orderNo) => {
    console.log('查看关联单号:', orderNo);
    // 这里可以跳转到订单详情页面
  };

  if (!itemInfo) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="item-change-history">
      {/* 头部 */}
      <div className="history-header">
        <Button 
          fill="none" 
          className="back-button"
          onClick={() => history.goBack()}
        >
          <LeftOutline />
        </Button>
        <div className="history-title">Item变动记录</div>
      </div>

      {/* Item基本信息 */}
      <div className="item-info-card">
        <div className="item-info-content">
          <div className="product-image-container">
            <img 
              src={itemInfo.productImage} 
              alt={itemInfo.productName}
              className="product-image"
            />
          </div>
          <div className="item-info-details">
            <div className="product-name">{itemInfo.productName}</div>
            <div className="item-basic-info">
              <div className="info-row">
                <span className="info-label">ItemID:</span>
                <span className="info-value item-id">{itemInfo.itemId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">ShopSku:</span>
                <span className="info-value">{itemInfo.shopSku}</span>
              </div>
              <div className="info-row">
                <span className="info-label">SellerSku:</span>
                <span className="info-value">{itemInfo.sellerSku}</span>
              </div>
              <div className="info-row">
                <span className="info-label">仓库:</span>
                <span className="info-value">{itemInfo.warehouseName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">当前状态:</span>
                {getStatusTag(itemInfo.currentStatus)}
              </div>
              <div className="info-row">
                <span className="info-label">入库时间:</span>
                <span className="info-value">{itemInfo.inboundTime}</span>
              </div>
              <div className="info-row">
                <span className="info-label">在库天数:</span>
                <span className="info-value days">{itemInfo.daysInWarehouse}天</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 变动历史列表 */}
      <div className="change-history-card">
        <div className="card-title">
          <ClockCircleOutline className="title-icon" />
          变动历史 ({changeHistory.length})
        </div>
        <List className="change-history-list">
          {changeHistory.map((record, index) => (
            <List.Item key={record.id} className="change-record-item">
              <div className="change-record-content">
                <div className="change-header">
                  <div className="change-time">{record.changeTime}</div>
                  {getChangeTypeTag(record.changeType)}
                </div>
                
                <div className="change-details">
                  <div className="change-row">
                    <div className="change-info">
                      <span className="change-label">变动数量:</span>
                      {formatChangeQuantity(record.changeQuantity)}
                    </div>
                    <div className="stock-change">
                      <span className="stock-before">{record.stockBefore}</span>
                      <span className="arrow">→</span>
                      <span className="stock-after">{record.stockAfter}</span>
                    </div>
                  </div>
                  
                  <div className="change-row">
                    <div className="change-info">
                      <span className="change-label">变动原因:</span>
                      <span className="change-reason">{record.changeReason}</span>
                    </div>
                  </div>
                  
                  {record.relatedOrderNo && (
                    <div className="change-row">
                      <div className="change-info">
                        <span className="change-label">关联单号:</span>
                        <span 
                          className="related-order clickable"
                          onClick={() => handleOrderClick(record.relatedOrderNo)}
                        >
                          {record.relatedOrderNo}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="change-row">
                    <div className="change-info">
                      <span className="change-label">操作人:</span>
                      <span className="operator">{record.operator}</span>
                    </div>
                  </div>
                  
                  {record.remark && (
                    <div className="change-row">
                      <div className="change-info full-width">
                        <span className="change-label">备注:</span>
                        <span className="remark">{record.remark}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </List.Item>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ItemChangeHistory;