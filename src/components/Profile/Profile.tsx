import CopyQRClipboard from "@/components/wallet/adress/CopyQRClipboard";
import { usePrivy } from "@privy-io/react-auth";

const Profile = ({ Selection }: { Selection?: boolean }) => {
    const { user } = usePrivy();
    // Find user name
    const Account = user?.linkedAccounts[0] as
        | { username: string }
        | undefined;
    const username = Account?.username;
    // Find user image
    const privyProfileUrl = user?.linkedAccounts[0] as
        | { profilePictureUrl: string }
        | undefined;
    const ProfileUrl = privyProfileUrl?.profilePictureUrl;

    return (
        <div className={`flex items-center`}>
            <img
                src={ProfileUrl}
                alt="Profile"
                className="rounded-xl w-10 h-10"
            />
            <div className="flex flex-col ml-2 text-sm">
                <span>@{username}</span>
                {Selection &&
                    <span className={`text-[#2E6F17]`}>
                        <CopyQRClipboard type="solana" />
                        <CopyQRClipboard type="ethereum" />
                    </span>
                }
            </div>
        </div>
    );
};

export default Profile; 