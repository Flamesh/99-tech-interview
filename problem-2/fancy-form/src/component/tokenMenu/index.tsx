import React, {useEffect, useState, useRef} from "react";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import type { ITokenData } from "../../typings/swap";
import type { IUserBalance } from "../../typings/user";
import SymbolImage from "../tokenImage";
import { isLandscape, isMobileDevice } from "../../utils/device";
import "./index.scss";

interface TokenMenuProps {
  listToken: ITokenData[];
  onTokenSelect: (token: ITokenData) => void;
  userBalance: IUserBalance[];
  tokenSymbol: string;
}

export default function TokenMenu({
  listToken,
  onTokenSelect,
  userBalance,
  tokenSymbol,
}: TokenMenuProps) {
  const isMobileLandscape = isMobileDevice() && isLandscape();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const [listTokenState, setListTokenState] = useState<ITokenData[]>(listToken);
  const [searchKeyword, setSearchKeyword] = useState("");
  

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    let timer = null;
    if (searchKeyword) {
      timer = setTimeout(() => {
        const filteredTokens = listToken.filter((token) =>
          token.currency.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setListTokenState(filteredTokens);
      }, 300);
    } else {
      setListTokenState(listToken);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [searchKeyword, listToken]);

  return (
    <Stack direction="row" spacing={2} className="token-menu-container">
      <div>
        <button
          ref={anchorRef}
          onClick={handleToggle}
          className={`flex items-center gap-2 bg-gray-800 rounded-lg p-2 w-[100px] hover:bg-[#15274f] cursor-pointer ${open ? "border border-blue-300" : ""}`}
        >
          <SymbolImage symbol={tokenSymbol} width={25} height={25} />
          <p className="text-[10px] text-gray-400">{tokenSymbol}</p>
        </button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
          className="z-10"
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <div className={`token-menu-list bg-gray-800 text-white w-[200px] overflow-y-auto ${isMobileLandscape ? "max-h-[170px]" : "max-h-[300px]"}`}>
                  <div className="sticky top-0 z-10">
                    <input
                      type="text"
                      placeholder="Search tokens"
                      className="w-full p-2 bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-blue-500"
                      value={searchKeyword}
                      onChange={(e) => {
                        e.preventDefault();
                        setSearchKeyword(e.target.value);
                      }}
                    />
                  </div>
                  {listTokenState.map((token, index) => (
                    <MenuItem
                      key={token.currency + index}
                      onClick={(event) => {
                        onTokenSelect(token);
                        handleClose(event);
                      }}
                      disableRipple
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f2f7f7",
                        },
                      }}
                    >
                      <div className="flex justify-between items-center w-full mt-1">
                        <div className="flex items-center gap-1">
                          <SymbolImage symbol={token.currency} width={20} height={20} />
                          <p className="text-[13px] text-gray-400">
                            {token.currency}
                          </p>
                        </div>

                        <p className="text-[13px] text-gray-400">
                          {userBalance.find((b) => b.symbol === token.currency)
                            ?.balance || 0}
                        </p>
                      </div>
                    </MenuItem>
                  ))}
                </div>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}
