import React, { useState, useEffect } from 'react';
import {
  Server,
  Play,
  CheckCircle2,
  AlertCircle,
  X,
  Code,
  Activity,
  Layers,
  Database,
  Clock,
  RefreshCw,
  Sliders,
  Send,
  Trash2,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  productsService,
  ordersService,
  serviceRegistry,
  HttpClient,
  ApiRequestLog
} from '../services';

interface ApiExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiExplorerModal: React.FC<ApiExplorerModalProps> = ({ isOpen, onClose }) => {
  const { products, orders } = useApp();
  const [selectedModule, setSelectedModule] = useState<'products' | 'orders'>('products');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('getProducts');
  const [requestParams, setRequestParams] = useState<string>('{\n  "limit": 5,\n  "page": 1\n}');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseDuration, setResponseDuration] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tester' | 'logs' | 'architecture'>('tester');
  const [logs, setLogs] = useState<ApiRequestLog[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [useMock, setUseMock] = useState(serviceRegistry.isUsingMock());
  const [latencyMs, setLatencyMs] = useState(200);

  // Subscribe to HTTP Telemetry logs
  useEffect(() => {
    const unsubscribe = HttpClient.subscribeToLogs(newLogs => {
      setLogs(newLogs);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  // Endpoint Presets
  const handleEndpointSelect = (ep: string) => {
    setSelectedEndpoint(ep);
    setErrorMsg(null);
    setResponseOutput(null);
    setResponseStatus(null);
    setResponseDuration(null);

    switch (ep) {
      case 'getProducts':
        setRequestParams(JSON.stringify({ limit: 5, page: 1, isTrending: true }, null, 2));
        break;
      case 'getProductById':
        setRequestParams(JSON.stringify({ id: products[0]?.id || 'prod-1' }, null, 2));
        break;
      case 'createProduct':
        setRequestParams(
          JSON.stringify(
            {
              name: 'Smart WiFi LED Bulb RGB 12W',
              category: 'Home & Kitchen',
              supplierId: 'sup-1',
              supplierName: 'Shah Alam Wholesale Hub',
              supplierCostPKR: 1250,
              recSellingPricePKR: 2199,
              stock: 45,
              image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
              description: 'Tuya Smart app compatible Pakistani B22 socket smart light'
            },
            null,
            2
          )
        );
        break;
      case 'adjustStock':
        setRequestParams(
          JSON.stringify(
            {
              id: products[0]?.id || 'prod-1',
              operation: 'INCREMENT',
              stockChange: 10,
              reason: 'Received shipment batch from Karachi port'
            },
            null,
            2
          )
        );
        break;
      case 'getCategories':
        setRequestParams('{}');
        break;
      case 'getOrders':
        setRequestParams(JSON.stringify({ limit: 5, page: 1, codRisk: 'LOW' }, null, 2));
        break;
      case 'getOrderById':
        setRequestParams(JSON.stringify({ orderId: orders[0]?.orderId || 'ORD-982341' }, null, 2));
        break;
      case 'createOrder':
        setRequestParams(
          JSON.stringify(
            {
              productId: products[0]?.id || 'prod-1',
              customerName: 'Muhammad Ali Jaffer',
              customerPhone: '03214567890',
              customerCity: 'Lahore',
              customerAddress: 'House 45, Block C, Model Town',
              sellingPricePKR: 2990,
              courierName: 'PostEx Express COD'
            },
            null,
            2
          )
        );
        break;
      case 'verifyCodOrder':
        setRequestParams(
          JSON.stringify(
            {
              orderId: orders[0]?.orderId || 'ORD-982341',
              isConfirmed: true,
              verificationMethod: 'WHATSAPP_OTP',
              customerNotes: 'Confirmed doorstep address and cash readiness'
            },
            null,
            2
          )
        );
        break;
      case 'dispatchOrder':
        setRequestParams(
          JSON.stringify(
            {
              orderId: orders[0]?.orderId || 'ORD-982341',
              courierId: 'courier-1',
              courierName: 'Trax Logistics COD',
              serviceType: 'EXPRESS_COD'
            },
            null,
            2
          )
        );
        break;
      case 'getOrderMetrics':
        setRequestParams('{}');
        break;
      default:
        setRequestParams('{}');
    }
  };

  // Execute Service Call
  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setResponseOutput(null);
    setResponseStatus(null);
    const start = Date.now();

    try {
      let parsedPayload: any = {};
      try {
        parsedPayload = JSON.parse(requestParams || '{}');
      } catch (err: any) {
        throw new Error(`Invalid JSON in Request Payload: ${err.message}`);
      }

      let res: any;

      if (selectedModule === 'products') {
        switch (selectedEndpoint) {
          case 'getProducts':
            res = await productsService.getProducts(parsedPayload);
            break;
          case 'getProductById':
            res = await productsService.getProductById(parsedPayload.id);
            break;
          case 'createProduct':
            res = await productsService.createProduct(parsedPayload);
            break;
          case 'adjustStock':
            res = await productsService.adjustStock(parsedPayload.id, {
              operation: parsedPayload.operation,
              stockChange: parsedPayload.stockChange,
              reason: parsedPayload.reason
            });
            break;
          case 'getCategories':
            res = await productsService.getCategories();
            break;
          case 'getTrendingProducts':
            res = await productsService.getTrendingProducts(parsedPayload.limit || 5);
            break;
          default:
            throw new Error(`Unknown endpoint: ${selectedEndpoint}`);
        }
      } else {
        switch (selectedEndpoint) {
          case 'getOrders':
            res = await ordersService.getOrders(parsedPayload);
            break;
          case 'getOrderById':
            res = await ordersService.getOrderById(parsedPayload.orderId);
            break;
          case 'createOrder':
            res = await ordersService.createOrder(parsedPayload);
            break;
          case 'verifyCodOrder':
            res = await ordersService.verifyCodOrder(parsedPayload.orderId, {
              isConfirmed: parsedPayload.isConfirmed ?? true,
              verificationMethod: parsedPayload.verificationMethod || 'WHATSAPP_OTP',
              customerNotes: parsedPayload.customerNotes
            });
            break;
          case 'dispatchOrder':
            res = await ordersService.dispatchOrder(parsedPayload.orderId, {
              courierId: parsedPayload.courierId || 'courier-1',
              courierName: parsedPayload.courierName || 'PostEx Express COD',
              serviceType: parsedPayload.serviceType || 'STANDARD_COD'
            });
            break;
          case 'getOrderMetrics':
            res = await ordersService.getOrderMetrics();
            break;
          default:
            throw new Error(`Unknown endpoint: ${selectedEndpoint}`);
        }
      }

      setResponseOutput(res);
      setResponseStatus(res.statusCode || 200);
      setResponseDuration(Date.now() - start);
    } catch (err: any) {
      setErrorMsg(err.message || 'API request failed');
      setResponseStatus(err.statusCode || 500);
      setResponseDuration(Date.now() - start);
      setResponseOutput(err.details || { error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(JSON.stringify(responseOutput, null, 2));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Modular API Service Layer</h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  SOA Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Service-oriented mock & production API client contract for Products & Orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* TABS */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('tester')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'tester'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Endpoint Tester
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'logs'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Live Telemetry ({logs.length})
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'architecture'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Architecture
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'tester' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: Controls & Payload */}
              <div className="lg:col-span-5 space-y-4">
                {/* Module Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Service Module
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setSelectedModule('products');
                        handleEndpointSelect('getProducts');
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        selectedModule === 'products'
                          ? 'border-emerald-500 bg-emerald-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-xs">Products Service</div>
                        <div className="text-[10px] text-slate-500">IProductsService</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedModule('orders');
                        handleEndpointSelect('getOrders');
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        selectedModule === 'orders'
                          ? 'border-emerald-500 bg-emerald-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Database className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-xs">Orders Service</div>
                        <div className="text-[10px] text-slate-500">IOrdersService</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Endpoint Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Contract Endpoint
                  </label>
                  <select
                    value={selectedEndpoint}
                    onChange={e => handleEndpointSelect(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {selectedModule === 'products' ? (
                      <>
                        <option value="getProducts">GET /api/v1/products (Paginated & Filtered)</option>
                        <option value="getProductById">GET /api/v1/products/:id</option>
                        <option value="createProduct">POST /api/v1/products (Create Product)</option>
                        <option value="adjustStock">PATCH /api/v1/products/:id/stock</option>
                        <option value="getCategories">GET /api/v1/products/categories</option>
                        <option value="getTrendingProducts">GET /api/v1/products/trending</option>
                      </>
                    ) : (
                      <>
                        <option value="getOrders">GET /api/v1/orders (Filtered Pipeline)</option>
                        <option value="getOrderById">GET /api/v1/orders/:orderId</option>
                        <option value="createOrder">POST /api/v1/orders (Book COD Order)</option>
                        <option value="verifyCodOrder">POST /api/v1/orders/:id/verify-cod (WhatsApp/OTP)</option>
                        <option value="dispatchOrder">POST /api/v1/orders/:id/dispatch (Courier AWB)</option>
                        <option value="getOrderMetrics">GET /api/v1/orders/metrics (Summary)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Service Config Drawer */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                      Mock Latency Simulation
                    </span>
                    <span className="text-emerald-400 font-mono font-bold text-[11px]">{latencyMs}ms</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={latencyMs}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setLatencyMs(val);
                      serviceRegistry.getHttpClient().setMockLatency(val);
                    }}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Active Provider:</span>
                    <span className="text-slate-300 font-mono font-medium">
                      {useMock ? 'MockService (Local Reactive Store)' : 'HttpApiService (REST Client)'}
                    </span>
                  </div>
                </div>

                {/* JSON Request Payload Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5" />
                      Request Parameters / DTO Body
                    </label>
                  </div>
                  <textarea
                    value={requestParams}
                    onChange={e => setRequestParams(e.target.value)}
                    rows={8}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                    spellCheck={false}
                  />
                </div>

                {/* Dispatch Button */}
                <button
                  onClick={handleExecuteRequest}
                  disabled={isLoading}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Executing Service Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Dispatch Service Request
                    </>
                  )}
                </button>
              </div>

              {/* RIGHT COLUMN: Response Viewer */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Response Envelope
                    </span>
                    {responseStatus !== null && (
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                          responseStatus >= 200 && responseStatus < 300
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        Status: {responseStatus}
                      </span>
                    )}
                    {responseDuration !== null && (
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {responseDuration}ms
                      </span>
                    )}
                  </div>

                  {responseOutput && (
                    <button
                      onClick={handleCopyJson}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? 'Copied' : 'Copy JSON'}
                    </button>
                  )}
                </div>

                <div className="flex-1 min-h-[360px] bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-auto font-mono text-xs text-slate-300">
                  {errorMsg && (
                    <div className="p-3 mb-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Error Caught</div>
                        <div>{errorMsg}</div>
                      </div>
                    </div>
                  )}

                  {responseOutput ? (
                    <pre className="text-emerald-400 leading-relaxed">
                      {JSON.stringify(responseOutput, null, 2)}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-12">
                      <Code className="w-8 h-8 text-slate-700" />
                      <p className="text-xs">Select an endpoint and click "Dispatch Service Request" to inspect output</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Live HTTP & Mock client request telemetry intercepted across the application.
                </p>
                <button
                  onClick={() => HttpClient.clearLogs()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Telemetry
                </button>
              </div>

              <div className="space-y-2">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs bg-slate-950 rounded-xl border border-slate-800">
                    No API requests logged yet. Trigger an endpoint in the tester or navigate the app!
                  </div>
                ) : (
                  logs.map(log => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            log.method === 'GET'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : log.method === 'POST'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : log.method === 'PUT' || log.method === 'PATCH'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {log.method}
                        </span>

                        <span className="font-mono text-slate-200">{log.endpoint}</span>

                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                            log.responseStatus >= 200 && log.responseStatus < 300
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {log.responseStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-slate-500 text-[11px] font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {log.durationMs}ms
                        </span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {log.isMock ? 'Mock' : 'Real HTTP'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-6 text-xs text-slate-300">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Service-Oriented Architecture (SOA) Design
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  The application uses decoupled contract interfaces (<code className="text-emerald-400">IProductsService</code> & <code className="text-emerald-400">IOrdersService</code>) with standard Data Transfer Objects (DTOs) and standardized response envelopes (<code className="text-emerald-400">ApiResponse&lt;T&gt;</code> & <code className="text-emerald-400">PaginatedResponse&lt;T&gt;</code>).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="font-bold text-white mb-1">1. Interface Isolation</div>
                    <div className="text-slate-400 text-[11px]">
                      Consumers (UI components & AppContext) depend strictly on abstract service contracts, not mock implementation details.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="font-bold text-white mb-1">2. Zero-Friction Backend Integration</div>
                    <div className="text-slate-400 text-[11px]">
                      When the production backend is deployed, switching from mock to live HTTP REST endpoints requires zero consumer code refactoring.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="font-bold text-white mb-1">3. Interceptor & Telemetry Pipeline</div>
                    <div className="text-slate-400 text-[11px]">
                      Centralized HTTP client handles JWT tokens, request/response transformation, and error normalization.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="font-bold text-white mb-1">4. Reactive Mock Store</div>
                    <div className="text-slate-400 text-[11px]">
                      State mutations (such as COD confirmations, inventory deductions, stock restores) persist and broadcast reactively.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
