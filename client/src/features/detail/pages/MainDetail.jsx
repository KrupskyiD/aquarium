import React, { /*useContext*/ } from 'react'
import { SCREENS } from "../../../shared/constants/screens";
import DesktopAppLayout from "../../../shared/components/DesktopAppLayout";
import { MetricsContext } from '../../../context/MetricsContext'
import MetricCard from '../components/MetricCard'
import ButtonCard from '../components/ButtonCard'

const MainDetail = ({onNavigate}) => {
    //getting metrics from context

    //hardcoded metrics just remove object and uncoment import with hook
    const metrics = /*useContext(MetricsContext)*/{
      salt:34.89,
      temp:28,
      limits:{
        salt:{
          text:"pod cilem",
          difference: 2
        },
        temp:{
          text:"pod cilem",
          difference: 4
        },
        
      }
    };

const pageContent = (
    <div className="flex flex-col gap-4 w-full mt-4">
      
        <div className='text-slate-400 text-xs font-semibold tracking-wider uppercase'>Metriky — kliknutím zobrazíte grafy</div>
        {/**METRICKS AND GRAPHS graphs hardcoded in MetricCard*/}
      <MetricCard value={metrics.salt} status={metrics.limits.salt} name='Salinity' unit="ppt"/>
      <MetricCard value={metrics.temp} status={metrics.limits.temp} name='Teplota' unit='°C'/>

      {/*SPARAVA ZARIZENI */}
      <div className='text-slate-400 text-xs font-semibold tracking-wider uppercase'>Správa zařízení</div>
      <ButtonCard title='Kalibrace senzoru salinity' onClick={() => console.log('Открываем калибровку')}
    icon={
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        {/**its an icon for calibration BRUH */}
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    }/>
      <ButtonCard title='Upravit' onClick={() => console.log('Открываем калибровку')}
    icon={
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    }/>
    <ButtonCard title='Odebrat akvárium' onClick={() => console.log('delete aquarium')} icon={
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      }
      />
    </div>
  );


 
  return (<>
      {/* Mobile version */}
      <section className="min-h-screen bg-[#0B1120] px-5 pt-8 pb-28 text-white md:hidden">
        <div className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-[760px] flex-col">
          
          {/* header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => onNavigate(SCREENS.AQUARIUM)} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#121A21] border border-slate-700/50"
            >
              &lt;
            </button>
            <h1 className="text-xl font-bold">Hlavní nádrž</h1>
          </div>

          {pageContent}
        </div>
      </section>

      {/* desktop version */}
      <div className="hidden md:block">
        <DesktopAppLayout
          title="Detail akvária"
          activeScreen={SCREENS.DETAIL}
          onNavigate={onNavigate}
        >
          {pageContent}
        </DesktopAppLayout>
      </div>
    </>
  );
}

export default MainDetail

