-- megafunction wizard: %LPM_SHIFTREG%
-- GENERATION: STANDARD
-- VERSION: WM1.0
-- MODULE: lpm_shiftreg 

-- ============================================================
-- File Name: lpm_shiftreg1.vhd
-- Megafunction Name(s):
-- 			lpm_shiftreg
--
-- Simulation Library Files(s):
-- 			lpm
-- ============================================================
-- ************************************************************
-- THIS IS A WIZARD-GENERATED FILE. DO NOT EDIT THIS FILE!
--
-- 9.1 Build 222 10/21/2009 SJ Web Edition
-- ************************************************************


--Copyright (C) 1991-2009 Altera Corporation
--Your use of Altera Corporation's design tools, logic functions 
--and other software and tools, and its AMPP partner logic 
--functions, and any output files from any of the foregoing 
--(including device programming or simulation files), and any 
--associated documentation or information are expressly subject 
--to the terms and conditions of the Altera Program License 
--Subscription Agreement, Altera MegaCore Function License 
--Agreement, or other applicable license agreement, including, 
--without limitation, that your use is for the sole purpose of 
--programming logic devices manufactured by Altera and sold by 
--Altera or its authorized distributors.  Please refer to the 
--applicable agreement for further details.


LIBRARY ieee;
USE ieee.std_logic_1164.all;

LIBRARY lpm;
USE lpm.all;

ENTITY lpm_shiftreg1 IS
	PORT
	(
		clock		: IN STD_LOGIC ;
		data		: IN STD_LOGIC_VECTOR (15 DOWNTO 0);
		enable		: IN STD_LOGIC ;
		load		: IN STD_LOGIC ;
		shiftin		: IN STD_LOGIC ;
		q		: OUT STD_LOGIC_VECTOR (15 DOWNTO 0)
	);
END lpm_shiftreg1;


ARCHITECTURE SYN OF lpm_shiftreg1 IS

	SIGNAL sub_wire0	: STD_LOGIC_VECTOR (15 DOWNTO 0);



	COMPONENT lpm_shiftreg
	GENERIC (
		lpm_direction		: STRING;
		lpm_type		: STRING;
		lpm_width		: NATURAL
	);
	PORT (
			enable	: IN STD_LOGIC ;
			load	: IN STD_LOGIC ;
			clock	: IN STD_LOGIC ;
			q	: OUT STD_LOGIC_VECTOR (15 DOWNTO 0);
			data	: IN STD_LOGIC_VECTOR (15 DOWNTO 0);
			shiftin	: IN STD_LOGIC 
	);
	END COMPONENT;

BEGIN
	q    <= sub_wire0(15 DOWNTO 0);

	lpm_shiftreg_component : lpm_shiftreg
	GENERIC MAP (
		lpm_direction => "RIGHT",
		lpm_type => "LPM_SHIFTREG",
		lpm_width => 16
	)
	PORT MAP (
		enable => enable,
		load => load,
		clock => clock,
		data => data,
		shiftin => shiftin,
		q => sub_wire0
	);



END SYN;

-- ============================================================
-- CNX file retrieval info
-- ============================================================
-- Retrieval info: PRIVATE: ACLR NUMERIC "0"
-- Retrieval info: PRIVATE: ALOAD NUMERIC "0"
-- Retrieval info: PRIVATE: ASET NUMERIC "0"
-- Retrieval info: PRIVATE: ASET_ALL1 NUMERIC "1"
-- Retrieval info: PRIVATE: CLK_EN NUMERIC "1"
-- Retrieval info: PRIVATE: INTENDED_DEVICE_FAMILY STRING "FLEX10K"
-- Retrieval info: PRIVATE: LeftShift NUMERIC "0"
-- Retrieval info: PRIVATE: ParallelDataInput NUMERIC "1"
-- Retrieval info: PRIVATE: Q_OUT NUMERIC "1"
-- Retrieval info: PRIVATE: SCLR NUMERIC "0"
-- Retrieval info: PRIVATE: SLOAD NUMERIC "1"
-- Retrieval info: PRIVATE: SSET NUMERIC "0"
-- Retrieval info: PRIVATE: SSET_ALL1 NUMERIC "1"
-- Retrieval info: PRIVATE: SYNTH_WRAPPER_GEN_POSTFIX STRING "0"
-- Retrieval info: PRIVATE: SerialShiftInput NUMERIC "1"
-- Retrieval info: PRIVATE: SerialShiftOutput NUMERIC "0"
-- Retrieval info: PRIVATE: nBit NUMERIC "16"
-- Retrieval info: CONSTANT: LPM_DIRECTION STRING "RIGHT"
-- Retrieval info: CONSTANT: LPM_TYPE STRING "LPM_SHIFTREG"
-- Retrieval info: CONSTANT: LPM_WIDTH NUMERIC "16"
-- Retrieval info: USED_PORT: clock 0 0 0 0 INPUT NODEFVAL clock
-- Retrieval info: USED_PORT: data 0 0 16 0 INPUT NODEFVAL data[15..0]
-- Retrieval info: USED_PORT: enable 0 0 0 0 INPUT NODEFVAL enable
-- Retrieval info: USED_PORT: load 0 0 0 0 INPUT NODEFVAL load
-- Retrieval info: USED_PORT: q 0 0 16 0 OUTPUT NODEFVAL q[15..0]
-- Retrieval info: USED_PORT: shiftin 0 0 0 0 INPUT NODEFVAL shiftin
-- Retrieval info: CONNECT: @clock 0 0 0 0 clock 0 0 0 0
-- Retrieval info: CONNECT: q 0 0 16 0 @q 0 0 16 0
-- Retrieval info: CONNECT: @enable 0 0 0 0 enable 0 0 0 0
-- Retrieval info: CONNECT: @shiftin 0 0 0 0 shiftin 0 0 0 0
-- Retrieval info: CONNECT: @load 0 0 0 0 load 0 0 0 0
-- Retrieval info: CONNECT: @data 0 0 16 0 data 0 0 16 0
-- Retrieval info: LIBRARY: lpm lpm.lpm_components.all
-- Retrieval info: GEN_FILE: TYPE_NORMAL lpm_shiftreg1.vhd TRUE
-- Retrieval info: GEN_FILE: TYPE_NORMAL lpm_shiftreg1.inc FALSE
-- Retrieval info: GEN_FILE: TYPE_NORMAL lpm_shiftreg1.cmp TRUE
-- Retrieval info: GEN_FILE: TYPE_NORMAL lpm_shiftreg1.bsf TRUE FALSE
-- Retrieval info: GEN_FILE: TYPE_NORMAL lpm_shiftreg1_inst.vhd FALSE
-- Retrieval info: LIB_FILE: lpm
