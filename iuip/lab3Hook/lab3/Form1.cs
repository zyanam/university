﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace lab3
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            setStateOfApp(startStopState);
        }
        private void groupBox1_Enter(object sender, EventArgs e)
        {

        }
        private string confButtonOpenText = "Hook manager";
        private string confButtonCloseText = "Close manager";
        private const int startStopState = 0;
        private const int openHookManager = 1;
        private const int createNewHook = 2;
        private const int editRemoveHook = 3;
        private int activeState;
        private void setStateOfApp(int state)
        {
            switch (state)
            {
                case startStopState:
                    {
                        startStopButton.Enabled = true;
                        configButton.Text = confButtonOpenText;
                        addHookButton.Hide();
                        hookGroup.Hide();
                        createHookGroup.Hide();
                        hookConf.Hide();
                        break;
                    }
                case openHookManager:
                    {
                        startStopButton.Enabled = false;
                        hooksList.ClearSelected();
                        hooksList.Enabled = true;
                        hookConf.Hide();
                        createHookGroup.Hide();
                        hookGroup.Show();
                        addHookButton.Show();
                        addHookButton.Enabled = true;
                        configButton.Text = confButtonCloseText;
                        break;
                    }
                case createNewHook:
                    {
                        startStopButton.Enabled = false;
                        hooksList.ClearSelected();
                        hooksList.Enabled = false;
                        hookGroup.Show();
                        hookConf.Hide();
                        createHookGroup.Show();
                        createKeyLabel.Text = "";
                        createCheckFade.Checked = false;
                        createEmulateText.Text = "";
                        createRunProcText.Text = "";
                        createStopProcText.Text = "";
                        addHookButton.Enabled = false;
                        addHookButton.Show();
                        configButton.Enabled = false;
                        configButton.Text = confButtonCloseText;
                        break;
                    }
                default:
                    throw new Exception("Cannot switch to anknown state of page");
            }
            activeState = state;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Hook.SetHook();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            Hook.UnHook();
        }

        private void Form1_FormClosed(object sender, FormClosedEventArgs e)
        {
        }

        private void configButton_Click(object sender, EventArgs e)
        {
            setStateOfApp(activeState == openHookManager ? startStopState : openHookManager);
        }

        private void label9_Click(object sender, EventArgs e)
        {

        }

        private void addHookButton_Click(object sender, EventArgs e)
        {
            setStateOfApp(createNewHook);
        }
    }
    class Hook
    {
        [DllImport("user32.dll")]
        static extern IntPtr SetWindowsHookEx(int idHook, LowLevelKeyboardProc callback, IntPtr hInstance, uint threadId);

        [DllImport("user32.dll")]
        static extern bool UnhookWindowsHookEx(IntPtr hInstance);

        [DllImport("user32.dll")]
        static extern IntPtr CallNextHookEx(IntPtr idHook, int nCode, int wParam, IntPtr lParam);

        [DllImport("kernel32.dll")]
        static extern IntPtr LoadLibrary(string lpFileName);

        private delegate IntPtr LowLevelKeyboardProc(int nCode, IntPtr wParam, IntPtr lParam);

        const int WH_KEYBOARD_LL = 13; // Номер глобального LowLevel-хука на клавиатуру 
        const int WM_KEYDOWN = 0x100; // Сообщения нажатия клавиши 

        private static LowLevelKeyboardProc _proc = hookProc;

        private static IntPtr hhook = IntPtr.Zero;

        public static void SetHook()
        {
            IntPtr hInstance = LoadLibrary("User32");
            hhook = SetWindowsHookEx(WH_KEYBOARD_LL, _proc, hInstance, 0);
        }

        public static void UnHook()
        {
            UnhookWindowsHookEx(hhook);
        }

        public static IntPtr hookProc(int code, IntPtr wParam, IntPtr lParam)
        {
            if (code >= 0 && wParam == (IntPtr)WM_KEYDOWN)
            {
                int vkCode = Marshal.ReadInt32(lParam);

                return (IntPtr)1;
            }
            else
                return CallNextHookEx(hhook, code, (int)wParam, lParam);
        }
    }
}
