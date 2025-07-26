import * as React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import type { ITokenData } from "../../typings/swap";
import type { IUserBalance } from "../../typings/user";
import SymbolImage from "../tokenImage";

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
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

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

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Stack direction="row" spacing={2}>
      <div>
        <button
          ref={anchorRef}
          onClick={handleToggle}
          className="flex items-center gap-2 bg-gray-800 rounded-lg p-2 w-[100px] hover:bg-[#15274f] cursor-pointer"
        >
          <SymbolImage symbol={tokenSymbol} />
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
                <MenuList
                  autoFocusItem={open}
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  className="bg-gray-800 text-white h-[300px] w-[200px] overflow-y-auto"
                >
                  {listToken.map((token, index) => (
                    <MenuItem
                      key={token.currency + index}
                      onClick={(event) => {
                        onTokenSelect(token);
                        handleClose(event);
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f2f7f7",
                        },
                      }}
                    >
                      <div className="flex justify-between items-center w-full mt-1">
                        <div className="flex items-center gap-1">
                          <SymbolImage symbol={token.currency} />
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
                </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  );
}
