import fs from 'fs-extra'
import { promisify } from 'util'
import path from 'path'
import glob from 'glob'

const globP = promisify(glob)

interface ConsolidateArgs {
  /* List of directories of content */
  files: string;
  root: string;
}

type Consolidate = (args: ConsolidateArgs) => Promise<string>
export const consolidate: Consolidate = async ({ root, files }) => {
  const read = async (file: string) => await fs.readFile(file, 'utf8')

  const absolutePath = path.join(root, files)
  const matchedPaths = await globP(absolutePath, { nodir: true })

  const contents = await Promise.all(matchedPaths.map(read))
  return contents.join('')
}