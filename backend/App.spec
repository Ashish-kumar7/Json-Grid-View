# -*- mode: python ; coding: utf-8 -*-


block_cipher = None


a = Analysis(['App.py'],
             pathex=['C:\\Users\\Abhishek\\Desktop\\JsonGrid\\Json-Grid-View\\backend'],
             binaries=[],
             datas=[],
             hiddenimports=['engineio.async_drivers.threading', 
             'engineio.async_drivers.aiohttp', 'engineio.async_aiohttp'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='App',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               upx_exclude=[],
               name='App')
