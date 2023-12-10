import "./app.css"
import type { FC } from "preact/compat"

import { atom, timeline } from "atom.io"
import { IMPLICIT } from "atom.io/internal"
import { useO, useI, useTL, useJSON } from "atom.io/react"
import { usePush } from "atom.io/realtime-react"
import { SetRTX } from "atom.io/transceivers/set-rtx"

import preactLogo from "./assets/preact.svg"
import viteLogo from "./assets/vite.svg"

IMPLICIT.STORE.loggers[0].logLevel = `info`

const countSetState = atom({
  key: `countSet`,
  default: () => new SetRTX<number>(),
  mutable: true,
  toJson: (set) => set.toJSON(),
  fromJson: (json) => SetRTX.fromJSON(json),
})

const countSetTL = timeline({
  key: `countSetTL`,
  atoms: [countSetState],
})

export const App: FC = () => {
  const setCountSet = useI(countSetState)
  const counts = useJSON(countSetState)
  const countSetTimeline = useTL(countSetTL)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank" rel="noreferrer">
          <img src={preactLogo} className="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Vite + Preact</h1>
      <div className="card">
        <h2>counts are:</h2>
        {counts.members.map((count) => (
          <button
            key={count}
            onClick={() =>
              setCountSet((countSet) => (countSet.delete(count), countSet))
            }
          >
            count is {count}
          </button>
        ))}
        <button
          onClick={() =>
            setCountSet((countSet) => countSet.add(countSet.size + 1))
          }
        >
          add count
        </button>
        <button
          onClick={() => {
            debugger
            countSetTimeline.undo()
          }}
        >
          undo
        </button>
        <button onClick={countSetTimeline.redo}>redo</button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
    </>
  )
}
