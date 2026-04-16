import SectionTitle from "../../../shared/components/SectionTitle";

const ProfileSection = ({ title, children, className = "" }) => {
  return (
    <div className={className}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
};

export default ProfileSection;
