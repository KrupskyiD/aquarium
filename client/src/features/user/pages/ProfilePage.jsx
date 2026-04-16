import { Bell, CircleHelp, Lock, UserRound } from "lucide-react";
import AppShell from "../../../shared/components/AppShell";
import ListItem from "../../../shared/components/ListItem";
import PrimaryCard from "../../../shared/components/PrimaryCard";
import TopBar from "../../../shared/components/TopBar";
import { SCREENS } from "../../../shared/constants/screens";
import ProfileSection from "../components/ProfileSection";
import ProfileUserHero from "../components/ProfileUserHero";

const ProfilePage = ({ onNavigate }) => {
  const user = {
    initials: "JN",
    name: "Jan Novák",
    email: "jan.novak@email.cz",
  };

  return (
    <AppShell>
      <PrimaryCard contentClassName="pb-6 md:pb-7">
        <TopBar title="Profil" />
        <ProfileUserHero user={user} />

        <div className="px-6 pt-5 md:pt-6 space-y-5">
          <ProfileSection title="Účet">
            <div className="space-y-2.5">
              <ListItem icon={<UserRound size={16} />} label="Upravit profil" onClick={() => {}} />
              <ListItem icon={<Lock size={16} />} label="Změnit heslo" onClick={() => {}} />
            </div>
          </ProfileSection>

          <ProfileSection title="Oznámení">
            <ListItem icon={<Bell size={16} />} label="Nastavení alertů" onClick={() => {}} />
          </ProfileSection>

          <ProfileSection title="Aplikace">
            <ListItem icon={<CircleHelp size={16} />} label="O aplikaci" suffix="v1.0.0" onClick={() => {}} />
          </ProfileSection>

          <ProfileSection title="Akvárium" className="pt-1">
            <ListItem
              label="Správa akvária"
              onClick={() => onNavigate?.(SCREENS.AQUARIUM)}
            />
          </ProfileSection>
        </div>
      </PrimaryCard>
    </AppShell>
  );
};

export default ProfilePage;