
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole, Restaurant, TarifaConfig, Carrera, CarreraStatus, TarifaType, Liquidacion, LiquidacionStatus, IncentiveChallenge } from './types';
import { INITIAL_RESTAURANTS, DEFAULT_TARIFAS } from './constants';
import { calculateFee } from './utils/calculations';
import { generateReport } from './utils/pdfGenerator';

// Components
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import AdminPanel from './components/AdminPanel';
import MotorizadoPanel from './components/MotorizadoPanel';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [tarifas, setTarifas] = useState<TarifaConfig[]>(DEFAULT_TARIFAS);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([]);
  const [incentives, setIncentives] = useState<IncentiveChallenge[]>([]);
  
  useEffect(() => {
    const savedUsers = localStorage.getItem('motogestion_users');
    const savedCarreras = localStorage.getItem('motogestion_carreras');
    const savedRest = localStorage.getItem('motogestion_restaurants');
    const savedTarifas = localStorage.getItem('motogestion_tarifas');
    const savedSession = localStorage.getItem('motogestion_session');
    const savedLiq = localStorage.getItem('motogestion_liquidaciones');
    const savedInc = localStorage.getItem('motogestion_incentives');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedCarreras) setCarreras(JSON.parse(savedCarreras));
    if (savedRest) setRestaurants(JSON.parse(savedRest));
    if (savedTarifas) setTarifas(JSON.parse(savedTarifas));
    if (savedSession) setCurrentUser(JSON.parse(savedSession));
    if (savedLiq) setLiquidaciones(JSON.parse(savedLiq));
    if (savedInc) setIncentives(JSON.parse(savedInc));
  }, []);

  useEffect(() => {
    localStorage.setItem('motogestion_users', JSON.stringify(users));
    localStorage.setItem('motogestion_carreras', JSON.stringify(carreras));
    localStorage.setItem('motogestion_restaurants', JSON.stringify(restaurants));
    localStorage.setItem('motogestion_tarifas', JSON.stringify(tarifas));
    localStorage.setItem('motogestion_liquidaciones', JSON.stringify(liquidaciones));
    localStorage.setItem('motogestion_incentives', JSON.stringify(incentives));
    if (currentUser) {
      localStorage.setItem('motogestion_session', JSON.stringify(currentUser));
    }
  }, [users, carreras, restaurants, tarifas, liquidaciones, incentives, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    navigate(user.role === UserRole.ADMIN ? '/admin' : '/motorizado');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('motogestion_session');
    navigate('/login');
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const registerCarrera = (data: Partial<Carrera>, targetMotorizado?: { id: string, name: string }) => {
    const motorizadoId = targetMotorizado?.id || currentUser?.id;
    const motorizadoName = targetMotorizado?.name || currentUser?.name;
    if (!motorizadoId || !motorizadoName) return;
    
    const restaurant = restaurants.find(r => r.id === data.restaurantId);
    if (!restaurant) return;

    const tarifaLocal = tarifas.find(t => t.type === restaurant.defaultTarifa) || tarifas[0];
    const price = calculateFee(data.km || 0, tarifaLocal);

    const tarifaEstandar = tarifas.find(t => t.type === TarifaType.ESTANDAR) || tarifas[0];
    const motorizadoEarnings = calculateFee(data.km || 0, tarifaEstandar);

    const newCarrera: Carrera = {
      id: Math.random().toString(36).substr(2, 9),
      motorizadoId,
      motorizadoName,
      restaurantId: data.restaurantId!,
      restaurantName: restaurant.name,
      clientName: data.clientName!,
      pointA: data.pointA!,
      pointB: data.pointB!,
      km: data.km!,
      price: price,
      motorizadoEarnings: motorizadoEarnings,
      status: currentUser?.role === UserRole.ADMIN ? CarreraStatus.APROBADA : CarreraStatus.PENDIENTE,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      tarifaUsed: restaurant.defaultTarifa
    };
    setCarreras(prev => [newCarrera, ...prev]);
  };

  const claimReward = (incentive: IncentiveChallenge) => {
    if (!currentUser) return;
    
    const rewardValue = typeof incentive.rewardValue === 'string' ? parseFloat(incentive.rewardValue) : incentive.rewardValue;

    const rewardClaim: Carrera = {
      id: 'RW-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      motorizadoId: currentUser.id,
      motorizadoName: currentUser.name,
      restaurantId: 'incentivo',
      restaurantName: '🎁 PREMIO POR DESAFÍO',
      clientName: `PREMIO: ${incentive.title}`,
      pointA: 'SISTEMA',
      pointB: 'MOTORIZADO',
      km: 0,
      price: 0,
      motorizadoEarnings: isNaN(rewardValue) ? 0 : rewardValue,
      status: CarreraStatus.PENDIENTE,
      date: new Date().toISOString(),
      tarifaUsed: TarifaType.ESTANDAR
    };
    
    setCarreras(prev => [rewardClaim, ...prev]);
    alert("¡Felicidades! Se ha enviado tu reclamo por $" + rewardClaim.motorizadoEarnings.toFixed(2) + " para aprobación.");
  };

  const updateCarreraStatus = (id: string, status: CarreraStatus) => {
    setCarreras(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const requestLiquidacion = (motorizadoId: string, amount: number) => {
    const approvedCarrerasIds = carreras
      .filter(c => c.motorizadoId === motorizadoId && c.status === CarreraStatus.APROBADA && !c.liquidacionId)
      .map(c => c.id);

    const newLiq: Liquidacion = {
      id: 'LIQ-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      motorizadoId,
      motorizadoName: currentUser?.name || 'Motorizado',
      amount,
      date: new Date().toISOString(),
      status: LiquidacionStatus.SOLICITADA,
      carrerasIds: approvedCarrerasIds
    };

    setLiquidaciones(prev => [newLiq, ...prev]);
    setCarreras(prev => prev.map(c => 
      approvedCarrerasIds.includes(c.id) ? { ...c, liquidacionId: newLiq.id } : c
    ));
  };

  const processPayment = (liqId: string, voucherRef: string) => {
    const liq = liquidaciones.find(l => l.id === liqId);
    if (!liq) return;
    setLiquidaciones(prev => prev.map(l => l.id === liqId ? { ...l, status: LiquidacionStatus.PAGADA, voucherRef } : l));
    setCarreras(prev => prev.map(c => liq.carrerasIds.includes(c.id) ? { ...c, status: CarreraStatus.LIQUIDADA } : c));
  };

  const handleGenerateReport = (type: 'motorizado' | 'restaurant' | 'general', filterId?: string) => {
    let title = 'Reporte General de Operaciones';
    let data = carreras;

    if (type === 'motorizado' && filterId) {
      const motorizado = users.find(u => u.id === filterId);
      title = `Reporte de Motorizado: ${motorizado?.name || filterId}`;
      data = carreras.filter(c => c.motorizadoId === filterId);
    } else if (type === 'restaurant' && filterId) {
      const restaurant = restaurants.find(r => r.id === filterId);
      title = `Reporte de Local: ${restaurant?.name || filterId}`;
      data = carreras.filter(c => c.restaurantId === filterId);
    }

    generateReport(title, data, type);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <main className="flex-grow" key={location.key}>
        <Routes>
          <Route path="/login" element={!currentUser ? <Auth onLogin={handleLogin} users={users} setUsers={setUsers} /> : <Navigate to={currentUser.role === UserRole.ADMIN ? "/admin" : "/motorizado"} />} />
          <Route path="/admin" element={currentUser?.role === UserRole.ADMIN ? <AdminPanel carreras={carreras} users={users} restaurants={restaurants} tarifas={tarifas} liquidaciones={liquidaciones} incentives={incentives} setIncentives={setIncentives} onUpdateStatus={updateCarreraStatus} onProcessPayment={processPayment} onToggleUser={id => setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))} onAddUser={u => setUsers(prev => [...prev, { ...u, id: Math.random().toString(36).substr(2, 9), active: true }])} onAddRestaurant={r => setRestaurants(prev => [...prev, { ...r, id: Math.random().toString(36).substr(2, 9), active: true }])} onGenerateReport={handleGenerateReport} onRegisterCarrera={registerCarrera} setRestaurants={setRestaurants} setTarifas={setTarifas} /> : <Navigate to="/login" />} />
          <Route path="/motorizado" element={currentUser?.role === UserRole.MOTORIZADO ? <MotorizadoPanel user={currentUser} onUpdateUser={updateUser} carreras={carreras.filter(c => c.motorizadoId === currentUser.id)} restaurants={restaurants.filter(r => r.active)} liquidaciones={liquidaciones.filter(l => l.motorizadoId === currentUser.id)} incentives={incentives} onRequestPayment={amount => requestLiquidacion(currentUser.id, amount)} onSave={registerCarrera} onClaimReward={claimReward} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={currentUser ? (currentUser.role === UserRole.ADMIN ? "/admin" : "/motorizado") : "/login"} />} />
        </Routes>
      </main>
      <footer className="bg-slate-800 text-slate-400 py-6 text-center text-sm"><p>© 2024 MotoGestion - Sistema de Control Logístico</p></footer>
    </div>
  );
};

export default App;
