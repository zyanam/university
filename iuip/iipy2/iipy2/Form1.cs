﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;


using System.IO;

namespace iipy2
{

    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            infoGroupBoxHide();
        }
        private OpenOrCloseCDDrive openOrClose = new OpenOrCloseCDDrive();
        private void infoGroupBoxHide()
        {
            infoGroupBox.Hide();
        }
        private void infoGroupBoxShow()
        {
            infoGroupBox.Show();
        }
        private void button1_Click(object sender, EventArgs e)
        {
            loadDiskAgain();
        }
        private DriveInfo[] diskInfo;
        private void loadDiskAgain()
        {
            infoGroupBoxHide();
            listBox1.Items.Clear();
            diskInfo = DriveInfo.GetDrives();
            foreach (DriveInfo info in diskInfo)
            {
                listBox1.Items.Add(info.Name);
            }
            
        }

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            int index = listBox1.SelectedIndex;
            DriveInfo info = diskInfo[index];

            if (info.Name != "")
            {
                infoGroupBoxShow();
                textName.Text = "Name: " + info.Name;
                textFileType.Text = "File type: " + info.DriveType;
                if (info.DriveType.ToString() == "CDRom")
                {
                    openOrClose.Open(info);
                    EjectDrive();
                }
                if (info.IsReady)
                {
                    textVolumeLabel.Show();
                    textFileSystem.Show();
                    textTotal.Show();
                    textFreeSpace.Show();
                    if (info.VolumeLabel != "")
                    {
                        textVolumeLabel.Text = "Volume label: " + info.VolumeLabel;
                    } else
                    {
                        textVolumeLabel.Hide();
                    }
                    textFileSystem.Text = "File system: " + info.DriveFormat;
                    textTotal.Text = "Total drive size: " + ConvertBytesToMegabytes(info.TotalSize);
                    textFreeSpace.Text = "Free space: " + ConvertBytesToMegabytes(info.AvailableFreeSpace);
                } else
                {
                    textVolumeLabel.Hide();
                    textFileSystem.Hide();
                    textTotal.Hide();
                    textFreeSpace.Hide();
                }
            }
        }
        static string ConvertBytesToMegabytes(long bytes)
        {
            double temp = (bytes / 1024f) / 1024f;
            if (temp > 1020f)
            {
                return (temp / 1024f).ToString("0.00") + " Gb";
            }
            return temp.ToString("0.00") + " Mb";
        }

        private void listView1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void richTextBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void textBox1_TextChanged(object sender, EventArgs e)
        {

        }
    };
}
