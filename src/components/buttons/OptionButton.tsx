import type { SetStateType } from "@/types";
import useCanvasSize from '@/lib/render/useCanvasSize';

type CustomComponentProps = {
	open: boolean;
	setOpen: SetStateType<boolean>
}


export default function OptionButton(props: CustomComponentProps){

	const {open, setOpen} = props;
  	const { isMobile } = useCanvasSize();

	return(
		<button 
			className={
				isMobile
				? 'flex justify-center items-center h-14 w-14 text-sm p-2 text-black rounded-full absolute right-10 top-6 bg-opacity-30 border-white border-2 bg-gray-100 z-50'
				: 'flex justify-center items-center h-16 w-16 text-sm p-2 text-black rounded-full self-end -translate-y-20 bg-opacity-30 border-white border-2 bg-gray-100 z-50'
			}
			onClick={() => setOpen(!open)}
		>
			{ !open ? 'options' : 'close' } 
		</button>
	);
}