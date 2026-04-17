import DesktopLayout from "./DesktopLayout";
import UserBar from "./UserBottomNav.jsx";
import UserBottomNav from "./UserBottomNav.jsx";

const AppLayout = ({ children, title, activeScreen, onNavigate}) => {
    return (
        <>
            {/*Dekstop version sidebar built in DesktopAppLayout  (md:block)*/}
            <div className = 'hidden md:block'>
            <DesktopLayout
                title={title}
                activeScreen={activeScreen}
                onNavigate={onNavigate}
            >
                {children}
            </DesktopLayout>
           </div>

            {/* Mobile version On full screen + bottom nav*/}
          <div className = 'block md:hidden min-h-screen  bg-[#090d1a] pb-24'>
              <header className= 'p-6'>
                  <h1 className= 'text-2xl font-bold text-white'>{title}</h1>
              </header>

              <main className= 'px-6'>
                  {children}
              </main>

              <UserBottomNav currentScreen={activeScreen} onNavigate={onNavigate} />
          </div>
    </>
    )
}